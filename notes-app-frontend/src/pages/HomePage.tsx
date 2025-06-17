import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { GET_MY_NOTES, SEARCH_NOTES } from '../graphql/queries';
import { CREATE_NOTE, UPDATE_NOTE, DELETE_NOTE } from '../graphql/mutations';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

interface Note {
  _id: string;
  title: string;
  content: string;
  contentHtml: string;
  createdAt: string;
  updatedAt: string;
}

const HomePage = () => {
  // State cho form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // 3. Sử dụng useQuery để lấy dữ liệu ban đầu
  const { data: allNotesData, loading: allNotesLoading, error: allNotesError, refetch: refetchAllNotes } = useQuery(GET_MY_NOTES);

  // 4. Sử dụng useLazyQuery cho việc tìm kiếm
  const [search, { data: searchedNotesData, loading: searchLoading, error: searchError }] = useLazyQuery(SEARCH_NOTES);

  // 5. Sử dụng useEffect để trigger tìm kiếm với debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        search({ variables: { searchTerm } });
      }
    }, 500); // Chờ 500ms sau khi gõ

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, search]);

  // 6. Quyết định dữ liệu nào sẽ được hiển thị
  const isLoading = allNotesLoading || searchLoading;
  const displayData = searchTerm.trim() !== '' ? searchedNotesData : allNotesData;
  const notes: Note[] = displayData?.myNotes || displayData?.searchNotes || [];
  const displayError = allNotesError || searchError;

  // Các mutation 
  const [createNote] = useMutation(CREATE_NOTE);
  const [updateNote] = useMutation(UPDATE_NOTE);
  const [deleteNote] = useMutation(DELETE_NOTE);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      const mutation = editingNote ? updateNote : createNote;
      const variables = editingNote ? { id: editingNote._id, title, content } : { title, content };
      await mutation({ variables });
      resetForm();
      refetchAllNotes(); // Luôn tải lại toàn bộ danh sách sau khi sửa/tạo
      setSearchTerm(''); // Xóa bộ lọc tìm kiếm
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote({ variables: { id } });
        refetchAllNotes(); // Tải lại toàn bộ danh sách
        if (searchTerm) {
          search({ variables: { searchTerm } }); // Nếu đang tìm kiếm, chạy lại tìm kiếm
        }
      } catch (err) {
        console.error('Failed to delete note:', err);
      }
    }
  };

  const startEditing = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
  };

  if (displayError) {
    if (displayError.message.includes('Unauthorized')) {
      logout();
      return <p>Session expired. Please log in again.</p>;
    }
    return <p>Error: {displayError.message}</p>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Header và Form giữ nguyên */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>My GraphQL Notes</h1>
        <div>
          <button onClick={toggleTheme} style={{ marginRight: '10px' }}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="note-card">
        <form onSubmit={handleFormSubmit}>
          <h2>{editingNote ? 'Edit Note' : 'Create New Note'}</h2>
          <input type="text" placeholder="Note Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea placeholder="Write your note here..." value={content} onChange={(e) => setContent(e.target.value)} required rows={10} />
          <div style={{ marginTop: '10px' }}>
            <button type="submit">{editingNote ? 'Update Note' : 'Create Note'}</button>
            {editingNote && <button type="button" onClick={resetForm} style={{ marginLeft: '10px' }}>Cancel Edit</button>}
          </div>
        </form>
      </section>

      <hr style={{ margin: '40px 0' }} />

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Your Notes List</h2>
          {/* Ô tìm kiếm */}
          <input
            type="search"
            placeholder="Search in notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '250px' }}
          />
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {notes.length > 0 ? (
              notes.map((note) => (
                <article key={note._id} className="note-card">
                  <h3>{note.title}</h3>
                  <small>Last Updated: {new Date(note.updatedAt).toLocaleString()}</small>
                  <div className="note-card-content" dangerouslySetInnerHTML={{ __html: note.contentHtml }} />
                  <div style={{ marginTop: '15px' }}>
                    <button onClick={() => startEditing(note)}>Edit</button>
                    <button onClick={() => handleDelete(note._id)} style={{ marginLeft: '10px' }}>Delete</button>
                  </div>
                </article>
              ))
            ) : (
              <p>{searchTerm ? `No notes found for "${searchTerm}".` : "You don't have any notes yet. Create one above!"}</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
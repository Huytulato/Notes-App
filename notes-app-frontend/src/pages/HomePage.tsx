// src/pages/HomePage.tsx

import React, { useState, useEffect, type FormEvent } from 'react';
import type { ChangeEvent } from 'react';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

// Định nghĩa kiểu dữ liệu cho một note để TypeScript hiểu rõ cấu trúc
interface Note {
  _id: string;
  title: string;
  content: string; // Nội dung Markdown gốc
  contentHtml: string; // Nội dung đã được chuyển sang HTML
  createdAt: string;
  updatedAt: string;
}

const HomePage = () => {
  // State quản lý danh sách các ghi chú
  const [notes, setNotes] = useState<Note[]>([]);
  
  // State cho form tạo/sửa ghi chú
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // State để xác định xem đang sửa ghi chú nào (null nghĩa là đang tạo mới)
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // State quản lý lỗi và thông báo
  const [error, setError] = useState('');

  // State tìm kiếm (nếu cần)
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Thêm state loading

  // Lấy các hàm cần thiết từ custom hooks
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // useEffect sẽ chạy một lần khi component được render lần đầu để lấy danh sách notes
  useEffect(() => {
    // Sử dụng debounce để tránh gọi API liên tục khi người dùng đang gõ
    const delayDebounceFn = setTimeout(() => {
      fetchNotes(searchTerm);
    }, 500); // Chờ 500ms sau khi người dùng ngừng gõ mới gọi API

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // Chạy lại effect này mỗi khi searchTerm thay đổi

  // Hàm gọi API để lấy tất cả ghi chú của người dùng
  const fetchNotes = async (searchQuery = '') => {
    setIsLoading(true);
    try {
      // Thêm params vào request nếu có searchQuery
      const response = await apiClient.get<Note[]>('/notes', {
        params: { search: searchQuery },
      });
      setNotes(response.data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setError('Could not load your notes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý khi submit form (cả tạo mới và cập nhật)
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content cannot be empty.');
      return;
    }

    const noteData = { title, content };

    try {
      if (editingNote) {
        // Nếu đang sửa -> gọi API PATCH
        await apiClient.patch(`/notes/${editingNote._id}`, noteData);
      } else {
        // Nếu đang tạo mới -> gọi API POST
        await apiClient.post('/notes', noteData);
      }
      
      // Sau khi thành công, reset form và tải lại danh sách notes
      resetForm();
      setSearchTerm(''); 
      if (searchTerm) {
        // Nếu đang có bộ lọc, fetchNotes sẽ được trigger bởi useEffect
      } else {
        fetchNotes();
      }
      fetchNotes();
    } catch (err) {
      console.error('Failed to save note:', err);
      setError('Could not save the note. Please try again.');
    }
  };

  // Hàm xử lý khi nhấn nút xóa
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await apiClient.delete(`/notes/${id}`);
        fetchNotes(searchTerm); // Tải lại danh sách với bộ lọc hiện tại
      } catch (err) {
        console.error('Failed to delete note:', err);
        setError('Could not delete the note.');
      }
    }
  };

  // Hàm được gọi khi người dùng nhấn nút "Edit" trên một note
  const startEditing = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content); // Điền nội dung Markdown gốc vào form
    window.scrollTo(0, 0); // Cuộn lên đầu trang để thấy form
  };

  // Hàm để reset trạng thái của form
  const resetForm = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setError('');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>My Notes</h1>
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
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Write your note here... (Markdown is supported!)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
          />
          <div style={{ marginTop: '10px' }}>
            <button type="submit">{editingNote ? 'Update Note' : 'Create Note'}</button>
            {editingNote && (
              <button type="button" onClick={resetForm} style={{ marginLeft: '10px' }}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <hr style={{ margin: '40px 0' }} />

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Your Notes List</h2>
          <input
            type="search"
            placeholder="Search in notes..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            style={{ width: '250px' }}
          />
        </div>

        <div>
          {isLoading ? (
            <p>Loading notes...</p>
          ) : notes.length > 0 ? (
            notes.map((note) => (
              <article key={note._id} className="note-card">
                <h3>{note.title}</h3>
                <small>
                  Created: {new Date(note.createdAt).toLocaleString()} | 
                  Last Updated: {new Date(note.updatedAt).toLocaleString()}
                </small>
                <div
                  className="note-card-content"
                  dangerouslySetInnerHTML={{ __html: note.contentHtml }}
                  style={{ marginTop: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}
                />
                <div style={{ marginTop: '15px' }}>
                  <button onClick={() => startEditing(note)}>Edit</button>
                  <button onClick={() => handleDelete(note._id)} style={{ marginLeft: '10px' }}>Delete</button>
                </div>
              </article>
            ))
          ) : (
            <p>You don't have any notes yet. Create one above!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
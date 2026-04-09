import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import QuestionAccordion from './components/QuestionAccordion';
import { Search, Moon, Sun, Menu, X } from 'lucide-react';

import questionsEn from './data/questions_en.json';
import questionsAr from './data/questions_ar.json';

function App() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Study Mode: Track completed questions persistently
  const [completedQs, setCompletedQs] = useState(() => {
    try {
      const stored = localStorage.getItem('completedQs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Track Light/Dark Mode
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('completedQs', JSON.stringify(completedQs));
  }, [completedQs]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load appropriate questions dataset based on language
  useEffect(() => {
    if (i18n.language === 'ar') {
      setQuestions(questionsAr);
    } else {
      setQuestions(questionsEn); 
    }
  }, [i18n.language]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleQuestionComplete = (id) => {
    setCompletedQs((prev) => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const categories = useMemo(() => {
    const cats = {};
    questions.forEach(q => {
      cats[q.category] = (cats[q.category] || { total: 0, qs: [] });
      cats[q.category].total += 1;
      cats[q.category].qs.push(q.id);
    });
    return Object.entries(cats).sort((a, b) => b[1].total - a[1].total);
  }, [questions]);

  // Bulk check entire category
  const toggleCategoryComplete = (e, qIds) => {
    e.stopPropagation();
    const allChecked = qIds.every(id => completedQs.includes(id));
    if (allChecked) {
      setCompletedQs(prev => prev.filter(id => !qIds.includes(id)));
    } else {
      setCompletedQs(prev => Array.from(new Set([...prev, ...qIds])));
    }
  };

  const filteredQuestions = useMemo(() => {
    let filtered = questions;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [questions, searchTerm, selectedCategory]);

  const getCategoryTranslation = (catName) => {
    const keyMap = {
      'Storage & Offline': 'cat_storage',
      'DOM & Events': 'cat_dom',
      'Functions & Closures': 'cat_functions',
      'Async & Promises': 'cat_async',
      'Objects & Classes': 'cat_objects',
      'Arrays & Collections': 'cat_arrays',
      'Types & Variables': 'cat_types',
      'Modern JS (ES6+)': 'cat_modern',
      'Error Handling': 'cat_errors',
      'Web APIs': 'cat_webAPI',
      'Regex & Math': 'cat_regex',
      'Core Fundamentals': 'cat_fundamentals',
      'Misc': 'cat_misc'
    };
    return keyMap[catName] ? t(keyMap[catName]) : catName;
  };

  // Progress metrics
  const totalProgress = questions.length ? (completedQs.length / questions.length) * 100 : 0;

  return (
    <div className="study-layout">
      {/* Top Fixed Navbar */}
      <nav className="top-navbar">
        <div className="nav-left">
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="logo">OSAD 46 Interview</div>
        </div>
        <div className="nav-search-bar search-box">
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="controls" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Light/Dark Mode">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar-fill" style={{ width: `${totalProgress}%` }} />
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <div className="app-container">
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header mobile-only">
            <h2>{t('app_title')}</h2>
            <button className="close-btn" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
          </div>
          <div className="category-list">
            <button 
              className={`category-btn ${selectedCategory === 'All' ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('All');
                setIsSidebarOpen(false);
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <input 
                  type="checkbox" 
                  className="custom-checkbox"
                  checked={completedQs.length === questions.length && questions.length > 0}
                  onChange={(e) => toggleCategoryComplete(e, questions.map(q => q.id))}
                  onClick={e => e.stopPropagation()}
                />
                <span>{t('cat_all')}</span>
              </div>
              <span className="category-count">{completedQs.length}/{questions.length}</span>
            </button>
            
            {categories.map(([catName, data]) => {
              const checkedCount = data.qs.filter(id => completedQs.includes(id)).length;
              return (
                <button 
                  key={catName}
                  className={`category-btn ${selectedCategory === catName ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(catName);
                    setIsSidebarOpen(false);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <input 
                      type="checkbox" 
                      className="custom-checkbox"
                      checked={checkedCount === data.total && data.total > 0}
                      onChange={(e) => toggleCategoryComplete(e, data.qs)}
                      onClick={e => e.stopPropagation()}
                    />
                    <span>{getCategoryTranslation(catName)}</span>
                  </div>
                  <span className="category-count">{checkedCount}/{data.total}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="main-content">
          <header className="header" style={{ marginBottom: '1.5rem', border: 'none', paddingBottom: 0 }}>
            <h1 style={{ fontSize: '1.8rem' }}>
              {selectedCategory === 'All' ? t('cat_all') : getCategoryTranslation(selectedCategory)}
            </h1>
          </header>

          <main>
            <div className="question-list">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((q) => (
                  <QuestionAccordion 
                    key={q.id} 
                    question={`${q.id}. ${q.question}`} 
                    answer={q.answer}
                    isCompleted={completedQs.includes(q.id)}
                    onToggleComplete={() => toggleQuestionComplete(q.id)}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <p>{t('no_results')}</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;

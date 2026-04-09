import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChevronDown } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Markdown Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-red-500">Error rendering answer: {this.state.error.toString()}</div>;
    }
    return this.props.children;
  }
}

const QuestionAccordion = ({ question, answer, isCompleted, onToggleComplete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`accordion-item ${isOpen ? 'is-open' : ''}`}>
      <button 
        className="accordion-header" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="accordion-header-left">
          <input 
            type="checkbox" 
            className="custom-checkbox" 
            checked={isCompleted} 
            onChange={onToggleComplete}
            onClick={(e) => e.stopPropagation()}
            title="Mark as completed"
          />
          <span>{question}</span>
        </div>
        <div className="accordion-header-right">
          <ChevronDown className="accordion-icon" />
        </div>
      </button>
      
      <div className="accordion-content-wrapper">
        <div className="accordion-content-inner">
          <div className="accordion-content">
            <ErrorBoundary>
              <div className="markdown-body">
                <ReactMarkdown
                  components={{
                    code(props) {
                      const {children, className, node, ...rest} = props
                      const match = /language-(\w+)/.exec(className || '')
                      return match ? (
                        <div className="code-wrapper">
                          <SyntaxHighlighter
                            {...rest}
                            PreTag="div"
                            children={String(children).replace(/\n$/, '')}
                            language={match[1]}
                            style={atomDark}
                          />
                        </div>
                      ) : (
                        <code {...rest} className={className}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {answer.replace(/^[ \t]{4}/gm, '')}
                </ReactMarkdown>
              </div>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionAccordion;

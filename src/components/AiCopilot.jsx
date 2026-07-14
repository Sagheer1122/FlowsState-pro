import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const PRODUCTIVITY_TIPS = [
  '⏳ 2-Minute Rule: If a task takes less than 2 minutes, do it right now. Putting it off takes more energy than completing it!',
  '☕ Pomodoro Technique: Focus intensely for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break.',
  '📊 Eisenhower Matrix: Organize tasks into 4 groups: Urgent-Important, Important-Not Urgent, Urgent-Not Important, and neither. Focus on Important-Not Urgent to prevent stress!',
  '🔋 Avoid Multitasking: Cognitive switching drains energy. Focus on exactly one task at a time for optimal quality and flow.',
  '✍️ Write it down: The human brain is for having ideas, not holding them. Get tasks out of your head and into FlowState Pro!'
];

export default function AiCopilot({ dispatch }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [tempKey, setTempKey] = useState(apiKey);

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hi there! I am your FlowState Pro AI Copilot. 👋 Need some help organizing your day? Ask me to "suggest coding tasks", "suggest design tasks", or "give me a tip"!`,
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Notify user to add key for real AI if not present
    if (!apiKey && isOpen && messages.length === 1) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: '💡 Real AI Setup: Click the settings gear icon (⚙️) in the header to enter your free Google Gemini API Key and enable real conversational AI answers!',
        },
      ]);
    }
  }, [apiKey, isOpen]);

  const systemInstruction = `
You are FlowState Pro AI Copilot, a helpful productivity assistant.
The user is ${user.name || 'Sagheer'}, working in ${user.department || 'Product Development'} as a ${user.role || 'Product Engineer'}.
Help the user organize their day, suggest task lists, or answer productivity questions.
If you suggest any tasks that the user can add to their checklist, you MUST append a JSON list of suggestions at the very end of your response in this EXACT format:
[SUGGESTIONS: [{"title": "Short Task Title", "priority": "high" | "medium" | "low", "category": "Engineering" | "Design" | "Docs" | "Marketing" | "Sales" | "General"}]]

Rules for suggestions:
- Keep task titles short, actionable, and under 50 characters.
- Set priority to "high", "medium", or "low".
- Set category to one of: "Engineering", "Design", "Docs", "Marketing", "Sales", "General".
- Do not output the [SUGGESTIONS] block unless you are actually recommending task cards to add.
`;

  const callGeminiApi = async (key, userText) => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nUser request: ${userText}` }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      let errMsg = `HTTP Error ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData?.error?.message) {
          errMsg = errorData.error.message;
        } else {
          errMsg = JSON.stringify(errorData);
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
      throw new Error(errMsg);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  };

  const parseAndAddReply = (replyText) => {
    let textWithoutSuggestions = replyText;
    let suggestions = null;

    const match = replyText.match(/\[SUGGESTIONS:\s*(\[.*?\])\s*\]/s);
    if (match) {
      try {
        suggestions = JSON.parse(match[1]);
        textWithoutSuggestions = replyText.replace(match[0], '').trim();
      } catch (e) {
        console.error('Failed to parse suggestions', e);
      }
    }

    setMessages((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: textWithoutSuggestions,
        suggestions,
      },
    ]);
  };

  function processMessage(userText) {
    if (isTyping) return;

    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsTyping(true);

    if (apiKey) {
      // Real API Mode
      callGeminiApi(apiKey, userText)
        .then((replyText) => {
          setIsTyping(false);
          parseAndAddReply(replyText);
        })
        .catch((err) => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: `⚠️ Gemini API Error: ${err.message}. Please check your API Key in the settings (⚙️).`,
            },
          ]);
        });
    } else {
      // Offline Mode Fallback
      setTimeout(() => {
        setIsTyping(false);
        let replyText = '';
        let suggestions = null;
        const lowerText = userText.toLowerCase();

        if (lowerText.includes('code') || lowerText.includes('program') || lowerText.includes('engineer') || lowerText.includes('dev')) {
          replyText = 'Here are some engineering task recommendations to streamline your codebase:';
          suggestions = [
            { title: 'Optimize database indexes', priority: 'high', category: 'Engineering' },
            { title: 'Write unit tests for Auth hook', priority: 'medium', category: 'Engineering' },
            { title: 'Setup GitHub Actions pipeline', priority: 'low', category: 'Engineering' }
          ];
        } else if (lowerText.includes('design') || lowerText.includes('ui') || lowerText.includes('ux') || lowerText.includes('figma') || lowerText.includes('css')) {
          replyText = 'Here are some design task suggestions to elevate your UI:';
          suggestions = [
            { title: 'Design Figma layout for mobile view', priority: 'high', category: 'Design' },
            { title: 'Audit colors for contrast accessibility', priority: 'medium', category: 'Design' },
            { title: 'Add hover micro-animations to list items', priority: 'low', category: 'Design' }
          ];
        } else if (lowerText.includes('doc') || lowerText.includes('write') || lowerText.includes('read') || lowerText.includes('guide')) {
          replyText = 'Documentation is key! Here are some tasks you can add:';
          suggestions = [
            { title: 'Draft API endpoint schemas guide', priority: 'medium', category: 'Docs' },
            { title: 'Update project configuration README', priority: 'low', category: 'Docs' }
          ];
        } else if (lowerText.includes('tip') || lowerText.includes('productivity') || lowerText.includes('quote') || lowerText.includes('advice')) {
          const randomTip = PRODUCTIVITY_TIPS[Math.floor(Math.random() * PRODUCTIVITY_TIPS.length)];
          replyText = `Here is a productivity tip for you:\n\n${randomTip}`;
        } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey') || lowerText.includes('yo')) {
          replyText = `Hello ${user.name}! 👋 How can I help you optimize your tasks and focus today?`;
        } else if (lowerText.includes('thanks') || lowerText.includes('thank you') || lowerText.includes('ty')) {
          replyText = "You're very welcome! Let's get back to crushing some goals. 🚀";
        } else if (lowerText.includes('who are you') || lowerText.includes('identity') || lowerText.includes('what do you do')) {
          replyText = 'I am your FlowState Pro AI Copilot. I analyze your productivity inquiries, suggest actionable tasks, and share expert time management tips.';
        } else if (lowerText.includes('help') || lowerText.includes('how') || lowerText.includes('suggest')) {
          replyText = 'I can suggest tasks tailored to your role. Try asking me for:\n- "suggest coding tasks"\n- "suggest design tasks"\n- "suggest doc tasks"\n- "give me a tip"';
        } else {
          replyText = "I'm here to help you focus! Tell me what you're working on, or try clicking one of the quick chips below for ideas. Add an API Key (⚙️) to unlock real AI conversation!";
        }

        setMessages((prev) => [...prev, { sender: 'ai', text: replyText, suggestions }]);
      }, 1000);
    }
  }

  function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    processMessage(input.trim());
    setInput('');
  }

  function handleAddSuggestion(taskSug, messageIdx, sugIdx) {
    dispatch({
      type: 'ADD_TASK',
      payload: {
        id: Date.now(),
        title: taskSug.title,
        done: false,
        priority: taskSug.priority,
        category: taskSug.category,
        dueDate: new Date().toISOString().split('T')[0],
      },
    });

    setMessages((prev) => {
      const copy = [...prev];
      const targetMsg = { ...copy[messageIdx] };
      const targetSugs = [...targetMsg.suggestions];
      targetSugs[sugIdx] = { ...targetSugs[sugIdx], added: true };
      targetMsg.suggestions = targetSugs;
      copy[messageIdx] = targetMsg;
      return copy;
    });

    showToast(`Added: "${taskSug.title}"! ✅`, 'success');
  }

  const handleSaveKey = (e) => {
    e.preventDefault();
    localStorage.setItem('gemini_api_key', tempKey.trim());
    setApiKey(tempKey.trim());
    setShowSettings(false);
    showToast('Gemini API Key saved! 🔑', 'success');
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setTempKey('');
    setShowSettings(false);
    showToast('Gemini API Key removed. Offline mode active.', 'info');
  };

  return (
    <div className="ai-copilot">
      {!isOpen && (
        <button className="ai-copilot__bubble" onClick={() => setIsOpen(true)}>
          ✨ Copilot
        </button>
      )}

      {isOpen && (
        <div className="ai-copilot__chat-box">
          <div className="chat-box__header">
            <div className="chat-box__header-title">✨ AI Copilot</div>
            <div className="chat-box__header-actions">
              <button 
                className="chat-box__gear-btn" 
                onClick={() => setShowSettings(!showSettings)}
                aria-label="Gemini API settings"
              >
                ⚙️
              </button>
              <button className="chat-box__close-btn" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>
          </div>

          {showSettings ? (
            <div className="chat-box__settings">
              <h4>Gemini API Settings</h4>
              <p>Enter your Gemini API key below to unlock real conversational AI intelligence.</p>
              <form onSubmit={handleSaveKey}>
                <input
                  type="password"
                  placeholder="Paste AI Studio Key..."
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  className="settings-input"
                />
                <div className="settings-actions">
                  <button type="submit" className="settings-btn settings-btn--save">Save</button>
                  {apiKey && (
                    <button type="button" onClick={handleRemoveKey} className="settings-btn settings-btn--remove">
                      Remove Key
                    </button>
                  )}
                </div>
              </form>
              <a 
                href="https://aistudio.google.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="settings-link"
              >
                Get a free API key from Google AI Studio ↗
              </a>
            </div>
          ) : (
            <>
              <div className="chat-box__messages">
                {messages.map((msg, mIdx) => (
                  <div key={mIdx} className={`chat-message chat-message--${msg.sender}`}>
                    <p className="chat-message__text">{msg.text}</p>
                    {msg.suggestions && (
                      <div className="chat-message__suggestions">
                        {msg.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            disabled={sug.added}
                            className={`suggestion-btn ${sug.added ? 'suggestion-btn--added' : ''}`}
                            onClick={() => handleAddSuggestion(sug, mIdx, sIdx)}
                          >
                            {sug.added ? `Added! ✓` : `+ Add: "${sug.title}"`}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="chat-message chat-message--ai chat-message--typing">
                    <span className="typing-dots">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-box__chips">
                <button type="button" onClick={() => processMessage('Suggest coding tasks')} className="chip-btn">
                  💻 Coding Tasks
                </button>
                <button type="button" onClick={() => processMessage('Suggest design tasks')} className="chip-btn">
                  🎨 Design Tasks
                </button>
                <button type="button" onClick={() => processMessage('Give me a productivity tip')} className="chip-btn">
                  💡 Focus Tip
                </button>
              </div>

              <form className="chat-box__input-area" onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder={apiKey ? "Ask Gemini Copilot…" : "Ask offline assistant…"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit">Send</button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}

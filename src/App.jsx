import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Loader from './loader';

function App() {
  const [count, setCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [originalMessages, setOriginalMessages] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState(['India', 'Government', 'Database']);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isBottom, setIsBottom] = useState(false);
  const itemsPerPage = 1000;
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isBottom) {
          setLoading(true);
          const response = await axios.get(`https://tgscraper.onrender.com/msg?page=${currentPage}`);
          setOriginalMessages((prevMessages) => [...prevMessages, ...response.data]);
  
          const filteredMessages = response.data.filter((message) =>
            message.content.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setMessages(filteredMessages);
  
          setCurrentPage((prevPage) => prevPage + 1); // Increment the page for the next request
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [ currentPage, isBottom]);
  
  const handleTagClick = (tag) => {
    // Update the searchTerm when a tag is clicked
    setSearchTerm(tag);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://tgscraper.onrender.com/msg?page=${currentPage}`);
        setOriginalMessages((prevMessages) => [...prevMessages, ...response.data]);

        const filteredMessages = response.data.filter((message) =>
          message.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setMessages(filteredMessages);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ currentPage, isBottom]);

  useEffect(() => {
    const fetchResults = async () => {
      if(searchTerm.length > 2) { // only search after 3+ chars  
        setLoading(true)
        const response = await axios.get(`https://tgscraper.onrender.com/search?query=${searchTerm}`);
        console.log(response.data)
        setSearchResults(response.data);
        setLoading(false)
      } 
    };

    fetchResults();
  
  }, [searchTerm]);

  const messagesToDisplay = searchTerm !== '' ? searchResults : originalMessages;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const messagesSlice = messagesToDisplay.slice(startIndex, endIndex);
  const totalMessages = messagesToDisplay.length;


  let Number = 0;

  function Numbering(lastNum) {
    Number += 1
    return Number;
  }


  return (
    <div className="app-container">
      <div className="search-container">
      <input
        type="text" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}  
      />
      <div id='SearchButton'>
        <img src="search.png" alt="" />
      </div> 

        <div className="suggested-tags">
          {suggestedTags.map((tag, index) => (
            <span key={index} className="tag" onClick={() => handleTagClick(tag)}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="messages-container">
        <h2>Telegram Messages</h2>

        { searchTerm &&
          <h3>Result Found : {totalMessages}</h3>
        }

        {loading ? (
          <Loader/>
        ) : (
          <>
            <ul className="message-list">
              {messagesSlice.map((message) => (
                <>
                <li key={message._id} className="message-card">
                <span>{Numbering(message.Mid)} : </span>
                  {message.content
                    .replace(/{|}/g, '')
                    .replace(/🔹 t.me\/breachdetector 🔹/g, '')
                    .replace(/['"]+/g, '')
                    .replace(/,/g, '    ||       ')
                    .trim()}
                </li>
                </>
              ))}
            </ul>
            {messagesToDisplay.length > itemsPerPage && (
              <div className="pagination">
                {Array.from({ length: Math.ceil(messagesToDisplay.length / itemsPerPage) }, (_, index) => (
                  <button key={index + 1} onClick={() => setCurrentPage(index + 1)}>
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;

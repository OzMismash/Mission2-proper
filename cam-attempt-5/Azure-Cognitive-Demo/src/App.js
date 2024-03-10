import React, { useState } from 'react';
import microsoft_logo from './microsoft-logo.svg';
import heart_symbol from './heart.svg';
import react_logo from './logo.svg';
import './App.css';
//hsdbkfjsbdskdb
const URLAPI = `/api`

function App() {

  // eslint-disable-next-line
  const [data, setData] = useState()
  // eslint-disable-next-line
  const [image, setImage] = useState('')

  const handleOnChange = event => {
    setImage(event.target.value)
  }

  const handleClickImage = async event => {
    event.preventDefault()
    console.log('click')
    try {
      const fetchOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: image,
        })
      }

      const resp = await fetch(`${URLAPI}/describe`, fetchOptions)
      const resDescrip = await resp.json()
      console.log(resDescrip.data)
      setData(resDescrip.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleVoiceIt = async event => {
    event.preventDefault()
    console.log('click')
    try {
      const utterance = new SpeechSynthesisUtterance(data.description.captions[0].text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Azure Cognitive Services with React!
        </p>
        <div className="Logos">
          <img src={microsoft_logo} className="Microsoft-logo" alt="azure-logo" /> <img src={heart_symbol} className="Heart-symbol" alt="heart-symbol" /> <img src={react_logo} className="React-logo" alt="react-logo" />
        </div>
        <p>
          Image URL for Face API:
        </p>
        <div className="containerFile">
          <input
            className="inputFile"
            placeholder="Upload image"
            onChange={handleOnChange}
            value={image} style={{ width: "450px" }}
          />
          <button
            className="buttonFile"
            onClick={handleClickImage}
          >
            Upload &amp; Check
          </button>
        </div>
        {data && data.description && data.description.tags && <span>Tags: {data.description.tags.join(" ")}</span>}
        <h4 className="titleAtribute">Image attributes: </h4>
        <ul>
          {
            data && data.description && data.description.captions && data.description.captions.map(item => (
              <li key={item.text}>
                <span>
                  {item.text} - Confidence level {parseInt((item.confidence * 100))}%
                </span>
                <button
                  className="buttonFile"
                  onClick={handleVoiceIt}
                >
                  Voice it!
                </button>
              </li>
            ))
          }
        </ul>
        <img
          src={image}
          width={220}
          height={180}
          alt={image}
        />
        Link of the image: <a
          className="App-link"
          href={image}
          target="_blank"
          rel="noopener noreferrer"
        >
          {image}
        </a>
      </header>
    </div>
  );
}

export default App;

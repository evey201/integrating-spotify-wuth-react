import  { useEffect, useState  } from 'react'
import axios from 'axios';
import './App.css';


export  const  App = ()  => {

  const  CLIENT_ID =  'enter client key here'
  const  REDIRECT_URI = 'http://localhost:3000'
  const  AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const  RESPONSE_TYPE = 'token'

  const [ token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([])

  useEffect(() => {
      const hash = window.location.hash
      let token = window.localStorage.getItem("token")

      if(!token && hash) {
        token = hash.substring(1).split("&").find(element => element.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
      }

      setToken(token)
  }, [])

  const Logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const searchArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: searchKey,
            type: "artist"
        }
    })

    setArtists(data.artists.items)
}

const renderArtists = () => {
  return artists.map(artist => (
      <div key={artist.id}>
          {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
          {artist.name}
      </div>
  ))
}

  return (
    <div className="App">
      <header className="App-header">
          <h3>Spotify app</h3>
          {
            !token ? 
                  <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to spotify</a>
                : <button onClick={Logout}>Logout</button>
          }

          {token &&
                    <form onSubmit={searchArtists}>
                        <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                        <button type={"submit"}>Search</button>
                    </form>
          }

          {renderArtists()}

      </header>
    </div>
  );
}


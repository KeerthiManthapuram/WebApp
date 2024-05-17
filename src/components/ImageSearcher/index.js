import {Component} from 'react'

import './index.css'

import {v4 as uuidv4} from 'uuid'

import Popup from 'reactjs-popup'

import 'reactjs-popup/dist/index.css'

import axios from 'axios'

import { FcPicture } from "react-icons/fc"

import { TbPhotoSearch } from "react-icons/tb"

const tabsList = [
    {
        id: uuidv4(),
        tab: "Mountains",
    },
    {
        id: uuidv4(),
        tab: "Flowers",
    },
    {
        id: uuidv4(),
        tab: "Cities",
    },
    {
        id: uuidv4(),
        tab: "Beaches",
    },
]

const apiUrl = 'https://api.unsplash.com/search/photos' 
console.log(apiUrl)
const apiKey = 'o8YOqdm75RtVii3A7x801q4Q8uJx_I4GiDvAnKZBoW0'
console.log(apiKey)
class ImageSearcher extends Component{
    state = {
        searchInput: '',
        activeTab: tabsList[0].id,
        images: [],
        error: null,
    }

    componentDidMount(){
        this.getImages()
    }

    getImages = async () => {
        const {searchInput} = this.state 
        const query = searchInput || tabsList.find(tab => tab.id === this.state.activeTab).tab;

        try {
            const response = await axios.get(apiUrl, {
                params: {
                    query: query,
                    client_id: apiKey,
                    per_page: 10,
                },
            });
            this.setState({ images: response.data.results, error: null })
        } catch (error) {
            this.setState({ error: 'Failed to fetch images. Please try again.' })
        }
    }
    

    onChangingInput = event => {
        this.setState({
            searchInput: event.target.value,
        })
    }

    onSubmit = event => {
        event.preventDefault()
        this.getImages()
        
    }

    onclickingTab = id => {
        const searchedImage = tabsList.find(each => each.id === id)
        this.setState({
            activeTab: id,
            searchInput: searchedImage.tab,
        }, 
    () => {
        this.getImages()
    }
    )
    }

    render(){
        const { searchInput, activeTab, images, error } = this.state
        
        return(
            <div className="app-container">
                <FcPicture size="100"/>
                <form className="search-input-holder" onSubmit={this.onSubmit}>
                    <input type="search" 
                    className="user-input" 
                    value={searchInput}
                    placeholder="Search here..."
                    onChange={this.onChangingInput}/> 
                    <button type="submit" className="search-icon-holder">
                    <TbPhotoSearch size="25" color="#ffffff"/>
                    </button>
                </form>
                <ul className="tabs-holder">
                    {tabsList.map(eachTab => (
                    <li key={eachTab.id}>
                    <button 
                    onClick={() => this.onclickingTab(eachTab.id)} 
                    className={`tab ${activeTab === eachTab.id ? 'active':''}`}>{eachTab.tab}</button>
                    </li>
                    ))}
                </ul>
                <div className="images-container">
                    {error && <p className="error-message">{error}</p>}
                    {images.map(image => (
                        <div key={image.id} className="image-item">
                            <Popup
                            trigger={
                            <img src={image.urls.small} alt={image.alt_description} />}
                            position="right center"
                            >
                            <div className="popup-container">
                            <p className="description">{image.alt_description}</p>
                            </div>
                            </Popup>
                            </div>
                            ))}
                        </div>        
                    </div>
                )
            }
        }




export default ImageSearcher
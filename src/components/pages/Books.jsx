import React, { useEffect, useState } from 'react'
import API_FIREBASE from '../../api/api_key'
import axios from 'axios'
import './Books.css'
// import data from '../../../public/data.json'
import { MdAddCircleOutline } from 'react-icons/md'
import { MdAddCircle } from 'react-icons/md'
import { FaSearch } from 'react-icons/fa'
import { Spinner } from 'reactstrap'
import Details from './Details'

function Books({ state, dispatch }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [icon, setIcon] = useState(false)
  const [flag, setFlag] = useState(false)

  const { reading, details } = state
  useEffect(() => {
    setLoading(true)
    const url = './data.json'
    axios
      .get(url)
      .then((response) => {
        setBooks(response.data.items)
        const action = {
          input: 'details',
          value: response.data.items,
        }

        dispatch(action)
      })
      .catch((error) => {
        console.log(error)
      })
      .then(() => {
        setLoading(false)
      })
  }, [])
  const addBookToList = (i, id) => {
    const redingList = [...books]
    const BooksJson = localStorage.getItem('reading')
    let BookList = JSON.parse(BooksJson)
    if (BooksJson === '[]') {
      BookList = new Array()
    }
    const index = BookList.findIndex((book) => book.id === id)
    if (!index) return alert('book in reading')
    const book = redingList[i]
    BookList.push(book)
    const jsonBook = JSON.stringify(BookList)
    localStorage.setItem('reading', jsonBook)

    const action = {
      input: 'reading',
      value: BookList,
    }
    dispatch(action)
    setIcon(i)
    alert('book add')
  }
  const handelSubmit = (e) => {
    e.preventDefault()
    const { search } = e.target
    const url = `https://www.googleapis.com/books/v1/volumes?q=${search.value}&key=${API_FIREBASE}&maxResults=40`
    axios
      .get(url)
      .then((response) => {
        setBooks(response.data.items)
      })
      .catch((error) => {
        console.log(error)
      })
      .then(() => {})
  }
  const showDetails = (id, i) => {
    setFlag(flag ? false : true)

    const BooksDetails = JSON.parse(localStorage.getItem('details'))
    const objBooks = BooksDetails.filter((book) => book.id === id)

    if (objBooks.length) {
      const action = { input: 'info', value: objBooks }
      dispatch(action)
    } else {
      const action = { input: 'info', value: [books[i]] }
      dispatch(action)
    }
  }
  const booksList = books.map((book, i) => {
    if (book.volumeInfo.imageLinks?.thumbnail) {
      return (
        <div className="column" key={i}>
          <figure className="flex">
            <div
              style={{
                backgroundImage: `url(${book.volumeInfo.imageLinks.thumbnail})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
              }}
              className="image-box"
              onClick={() => showDetails(book.id, i)}
            />

            <div>
              <h3>{book.volumeInfo.title}</h3>
              <p>{book.volumeInfo.authors}</p>
              <p>{book.volumeInfo.description} </p>
              <button
                onClick={() => addBookToList(i, book.id)}
                title={'add to read'}
                className="btn"
              >
                {icon === i ? <MdAddCircle /> : <MdAddCircleOutline />}
              </button>
            </div>
          </figure>
        </div>
      )
    }
  })

  const jsonBook = JSON.stringify(details)
  const jsonDetails = localStorage.getItem('details')
  if (jsonDetails === '[]') {
    localStorage.setItem('details', jsonBook)
  }

  const detailsBook = flag ? <Details state={state} dispatch={dispatch} /> : ''
  const showSpinner = loading ? <Spinner animation="grow" size="sm" /> : ''
  return (
    <div className="background-div">
      <br />
      <br />
      {detailsBook}
      <br />

      <form className="search" onSubmit={handelSubmit}>
        <input
          type="search"
          placeholder="Search here..."
          name="search"
          required
        />
        <button type="submit">
          <FaSearch />
        </button>
      </form>

      {showSpinner}
      {booksList}
    </div>
  )
}

export default Books

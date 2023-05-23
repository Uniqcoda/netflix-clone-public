import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { collection, query, where, getDocs, doc, addDoc, updateDoc } from 'firebase/firestore';
import db from '../utils/firebase';
import userReducer from '../store/userSlice';
import { API_KEY, TMDB_BASE_URL } from '../utils/constants';

const initialState = {
  movies: [],
  genresLoaded: false,
  genres: [],
  userList: [],
};

export const getGenres = createAsyncThunk('netflix/genres', async () => {
  const {
    data: { genres },
  } = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  return genres;
});

const createArrayFromRawData = (array, moviesArray, genres) => {
  array.forEach((movie) => {
    const movieGenres = [];
    movie.genre_ids.forEach((genreId) => {
      const name = genres.find(({ id }) => id === genreId);
      if (name) movieGenres.push(name.name);
    });
    // If a movie does not have a back_drop image, it would be skipped
    if (movie.backdrop_path)
      moviesArray.push({
        id: movie.id,
        name: movie?.name || movie?.title || movie?.original_title || movie?.original_name || 'Movie Title',
        image: movie.backdrop_path,
        genres: movieGenres.slice(0, 3),
      });
  });
};

const getRawData = async (api, genres, paging = false) => {
  const moviesArray = [];
  // There are 20 movies per request, run at-least 3 times to fetch 60 movies.
  for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
    const {
      data: { results },
    } = await axios.get(`${api}${paging ? `&page=${i}` : ''}`);
    createArrayFromRawData(results, moviesArray, genres);
  }
  return moviesArray;
};

export const fetchDataByGenre = createAsyncThunk('netflix/genre', async ({ genre, type }, thunkAPI) => {
  const {
    netflix: { genres },
  } = thunkAPI.getState();

  return getRawData(`${TMDB_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}`, genres);
});

export const fetchMovies = createAsyncThunk('netflix/trending', async ({ type }, thunkAPI) => {
  const {
    netflix: { genres },
  } = thunkAPI.getState();

  return getRawData(`${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`, genres, true);
});

export const addToLikes = createAsyncThunk('netflix/addLike', async ({ movieData, userId }) => {
  try {
    // Check if user has a movie list
    const q = query(collection(db, 'movie-lists'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnapshot = querySnapshot.docs[0];
      const movieList = docSnapshot.data();
      // check if movie is already in user list
      const index = movieList.movies.findIndex((movie) => movie.id === movieData.id);

      if (index > -1) {
        alert('Movie already added to your list');
        return;
      }
      // update list
      movieList.movies.push(movieData);
      await updateDoc(doc(db, 'movie-lists', docSnapshot.id), { movies: movieList.movies });
      alert('Movie added to your list');
    } else {
      // create new list
      const movieListsRef = collection(db, 'movie-lists');
      await addDoc(movieListsRef, {
        userId,
        movies: [movieData],
      });
      alert('Movie added to your list');
    }
  } catch (error) {
    console.log({ error });
  }
});

export const getUsersLikedMovies = createAsyncThunk('netflix/getLiked', async (userId) => {
  let userList = [];
  const q = query(collection(db, 'movie-lists'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docSnapshot = querySnapshot.docs[0];
    const movieList = docSnapshot.data();
    userList = movieList.movies;
  }
  return userList;
});

export const removeMovieFromLiked = createAsyncThunk('netflix/deleteLiked', async ({ movieId, userId }) => {
  try {
    // Get user's movie list
    const q = query(collection(db, 'movie-lists'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const docSnapshot = querySnapshot.docs[0];
    const movieList = docSnapshot.data();
    // Get movie index and remove movie from list
    const index = movieList.movies.findIndex((movie) => movie.id === movieId);
    if (index !== -1) movieList.movies.splice(index, 1);
    // update list in db
    await updateDoc(doc(db, 'movie-lists', docSnapshot.id), { movies: movieList.movies });
    alert('Movie removed from your list');
    return movieList.movies || [];
  } catch (error) {
    console.log({ error });
  }
});

const NetflixSlice = createSlice({
  name: 'Netflix',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getGenres.fulfilled, (state, action) => {
      state.genres = action.payload;
      state.genresLoaded = true;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(fetchDataByGenre.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(getUsersLikedMovies.fulfilled, (state, action) => {
      state.userList = action.payload;
    });
    builder.addCase(removeMovieFromLiked.fulfilled, (state, action) => {
      state.userList = action.payload;
    });
  },
});

export const store = configureStore({
  reducer: {
    netflix: NetflixSlice.reducer,
    user: userReducer,
  },
});

export const { setGenres, setMovies } = NetflixSlice.actions;

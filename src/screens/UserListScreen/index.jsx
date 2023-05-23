import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';
import Card from '../../components/Card';
import Nav from '../../components/Nav';
import { getUsersLikedMovies } from '../../store';
import './index.css';

export default function UserList() {
  const movies = useSelector((state) => state.netflix.userList);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user) {
      dispatch(getUsersLikedMovies(user.uid));
    }
  }, [dispatch, user]);

  return (
    <div className='userList'>
      <Nav />
      <div className='content'>
        <h1>My List</h1>
        <div className='grid'>
          {movies.length > 0 ? (
            movies.map((movie, index) => {
              return <Card movieData={movie} index={index} key={movie.id} isLiked={true} />;
            })
          ) : (
            <p>You have not added any movie to your list yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

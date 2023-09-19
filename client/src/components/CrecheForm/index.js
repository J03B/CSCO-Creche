import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_CRECHE } from '../../utils/mutations';
import { QUERY_MY_CRECHES, QUERY_ME } from '../../utils/queries';

import Auth from '../../utils/auth';

const CrecheForm = () => {
  const [crecheText, setCrecheText] = useState('');

  const [characterCount, setCharacterCount] = useState(0);

  const [addCreche, { error }] = useMutation(ADD_CRECHE, {
    update(cache, { data: { addCreche } }) {
      try {
        const { creches } = cache.readQuery({ query: QUERY_MY_CRECHES });

        cache.writeQuery({
          query: QUERY_MY_CRECHES,
          data: { creches: [addCreche, ...creches] },
        });
      } catch (e) {
        console.error(e);
      }

      // update me object's cache
      const { me } = cache.readQuery({ query: QUERY_ME });
      cache.writeQuery({
        query: QUERY_ME,
        data: { me: { ...me, creches: [...me.creches, addCreche] } },
      });
    },
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addCreche({
        variables: {
          crecheDescription: crecheText,
          crecheUser: Auth.getProfile().data.username,
        },
      });

      setCrecheText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'crecheDescription' && value.length <= 280) {
      setCrecheText(value);
      setCharacterCount(value.length);
    }
  };

  return (
    <div>
      <h3>What Creche would you like to donate for the event?</h3>

      {Auth.loggedIn() ? (
        <>
          <p
            className={`m-0 ${
              characterCount === 280 || error ? 'text-danger' : ''
            }`}
          >
            Character Count: {characterCount}/280
          </p>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="col-12 col-lg-9">
              <textarea
                name="crecheDescription"
                placeholder="Describe this new creche..."
                value={crecheText}
                className="form-input w-100"
                style={{ lineHeight: '1.5', resize: 'vertical' }}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12 col-lg-3">
              <button className="btn btn-primary btn-block py-3" type="submit">
                Add Creche
              </button>
            </div>
            {error && (
              <div className="col-12 my-3 bg-danger text-white p-3">
                {error.message}
              </div>
            )}
          </form>
        </>
      ) : (
        <p>
          You need to be logged in to share your creches. Please{' '}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default CrecheForm;

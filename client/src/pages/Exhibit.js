import React from 'react';

// Import the `useParams()` hook
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { QUERY_CRECHE } from '../utils/queries';

const Exhibit = () => {
  // Use `useParams()` to retrieve value of the route parameter `:profileId`
  const { crecheId } = useParams();

  const { loading, data } = useQuery(QUERY_CRECHE, {
    // pass URL parameter
    variables: { crecheId: crecheId },
  });

  const creche = data?.creche || {};

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="my-3">
      <h3 className="card-header bg-dark text-light p-2 m-0">
        {creche.crecheUser} <br />
        <span style={{ fontSize: '1rem' }}>
          donated this creche on {creche.createdAt}
        </span>
      </h3>
      <div className="bg-light py-4">
        <blockquote
          className="p-4"
          style={{
            fontSize: '1.5rem',
            fontStyle: 'italic',
            border: '2px dotted #1a1a1a',
            lineHeight: '1.5',
          }}
        >
          {creche.crecheDescription}
        </blockquote>
      </div>
    </div>
  );
};

export default Exhibit;

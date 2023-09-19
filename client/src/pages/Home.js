import React from 'react';
import { useQuery } from '@apollo/client';

import CrecheList from '../components/CrecheList';
import CrecheForm from '../components/CrecheForm';

import { QUERY_ALL_CRECHES } from '../utils/queries';

const Home = () => {
  const { loading, data } = useQuery(QUERY_ALL_CRECHES);
  const creches = data?.allCreches || [];

  return (
    <main>
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: '1px dotted #1a1a1a' }}
        >
          <CrecheForm />
        </div>
        <div className="col-12 col-md-8 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <CrecheList
              creches={creches}
              title="Creches donated so far..."
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;

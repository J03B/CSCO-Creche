import React from 'react';
import { Link } from 'react-router-dom';

const CrecheList = ({
  creches,
  title,
  showTitle = true,
  showUsername = true,
}) => {
  if (!creches.length) {
    return <h3>No Creches Donated Yet</h3>;
  }

  return (
    <div>
      {showTitle && <h3>{title}</h3>}
      {creches &&
        creches.map((creche) => (
          <div key={creche._id} className="card mb-3">
            <h4 className="card-header bg-primary text-light p-2 m-0">
              {showUsername ? (
                <Link
                  className="text-light"
                  to={`/profiles/${creche.crecheUser}`}
                >
                  {creche.crecheUser} {' '}
                    had this creche on {creche.createdAt}
                </Link>
              ) : (
                <>
                  <span style={{ fontSize: '1rem' }}>
                    You had this creche on {creche.createdAt}
                  </span>
                </>
              )}
            </h4>
            <div className="card-body bg-light p-2">
              <p>Origin: {creche.crecheOrigin}</p>
              <p>Description: {creche.crecheDescription}</p>
            </div>
            <Link
              className="btn btn-primary btn-block btn-squared"
              to={`/creches/${creche._id}`}
            >
              View more about this creche.
            </Link>
          </div>
        ))}
    </div>
  );
};

export default CrecheList;

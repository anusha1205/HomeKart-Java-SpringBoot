// import React from 'react';
// import { Link } from 'react-router-dom';

// function Navbar() {
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');

//   return (
//     <nav style={{
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '1rem 2rem',
//       background: '#333',
//       color: 'white'
//     }}>
//       <div>
//         <Link to="/" style={{ color: 'white', marginRight: '2rem', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
//           HomeKart
//         </Link>
//       </div>
//       <div style={{ display: 'flex', gap: '1rem' }}>
//         {!token ? (
//           <>
//             <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
//             <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Signup</Link>
//           </>
//         ) : (
//           <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>
//             Profile ({role})
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: '#333',
      color: 'white'
    }}>
      <div>
        <Link to="/" style={{ color: 'white', marginRight: '2rem', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          HomeKart
        </Link>

        {token && role === 'seller' && (
          <>
            <Link to="/seller/dashboard" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>View Products</Link>
            <Link to="/seller/add-product" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Add Product</Link>
            <Link to="/seller/orders" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>View Orders</Link>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {!token ? (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Signup</Link>
          </>
        ) : (
          <>
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>
              Profile ({role})
            </Link>
            <button onClick={handleLogout} style={{
              background: '#e60000',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

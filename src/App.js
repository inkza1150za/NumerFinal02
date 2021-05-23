import React from 'react';
import './App.css';
import ppp from './ppp';
import home from './page/home';
import Bisection from './page/unit_1/bisection';
import Falseposition from './page/unit_1/False-position';
import Onepoint from './page/unit_1/One-point';
import NewtonRaph from './page/unit_1/Newton_rapson';
import Secant from './page/unit_1/Secant';
import Cramer from './page/unit_2/Cramer';
import Gauss from './page/unit_2/Gauss-Eliminate';
import Jordan from './page/unit_2/Gauss-Jordan';
import LU from './page/unit_2/LU-Decomposion';
import Cholesky from './page/unit_2/Cholesky-Decomposition';
import Jacobi from './page/unit_2/Jacobi-Iteration';
import Seidel from './page/unit_2/Seidel';
import Gradient from './page/unit_2/Conjugate-Gradient';
import Newton from './page/unit_3/Newton';
import Lagrange from './page/unit_3/Lagrange';
import Spline from './page/unit_3/Spline';

import Linear from './page/unit_4/Regress-Linear';
import MultipleLinear from './page/unit_4/Regress-MultipleLinear';
import Polynomial from './page/unit_4/Regress-Polynomial';

import Container from 'react-bootstrap/Container'


import { BrowserRouter as Router, Switch, Route, Link, BrowserRouter } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div className="App">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.3/css/all.css"></link>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.3/css/v4-shims.css"></link>
        <body>
          <div class="menu-bar">
            <ul>
              <li class="active" ><Link to="/"><b>NUMERNICAL</b></Link></li>
              <li><a>Root of Equations</a>
                <div class="sub-menu-1">
                  <ul>
                    <li><Link to="/Bisection">Bisection</Link></li>
                    <li><Link to="/False-position">False-position</Link></li>
                    <li><Link to="/One-point">One-point</Link></li>
                    <li><Link to="/Newton_rapson">Newton-rapson</Link></li>
                    <li><Link to="/Secant">Secant</Link></li>
                  </ul>
                </div>
              </li>
              <li><a>Linear Equations</a>
                <div class="sub-menu-1">
                  <ul>
                    <li><Link to="/Cramer">Cramer's Rule</Link></li>
                    <li><Link to="/Gauss-eliminate">Gauss Elimination Method</Link></li>
                    <li><Link to="/Gauss-Jordan">Gauss-Jordan Method</Link></li>
                    <li><Link to="/LU-Decomposion">LU-Decomposion</Link></li>
                    <li><Link to="/Cholesky-Decomposition">Cholesky Decomposition Method</Link></li>
                    <li><Link to="/Jacobi-Iteration">Jacobi Iteration Method</Link></li>
                    {/* <li><Link to="/Gauss-Seidel">Gauss-Seidel Itaration Method</Link></li>
                    <li><Link to="/Conjugate-Gradient">Conjugate Gradient Method</Link></li> */}
                  </ul>
                </div>
              </li>
              <li><a>Interpolation Techhique</a>
                <div class="sub-menu-1">
                  <ul>
                    <li><Link to="/Newton's divided-differences">Newton's divided-differences</Link></li>
                    <li><Link to="/Lagrange polynomials">Lagrange polynomials</Link></li>
                    <li><Link to="/Spline interpolation">Spline interpolation</Link></li>
                    {/* <li class="hover-me"><a href="#">Newton's divided-differences</a><i class="fas fa-angle-right"></i>
                      <div class="sub-menu-2">
                        <ul>
                          <li><Link to="/">Lineare</Link></li>
                          <li><Link to="/">Quadratic</Link></li>
                          <li><Link to="/">Polynomials</Link></li>
                        </ul>
                      </div>
                    </li>
                    <li class="hover-me"><a href="#">Lagrange polynomials</a><i class="fas fa-angle-right"></i>
                      <div class="sub-menu-2">
                        <ul>
                          <li><Link to="/">Lineare</Link></li>
                          <li><Link to="/">Quadratic</Link></li>
                          <li><Link to="/">Polynomials</Link></li>
                        </ul>
                      </div>
                    </li>
                    <li class="hover-me"><a href="#">Spline interpolation</a><i class="fas fa-angle-right"></i>
                      <div class="sub-menu-2">
                        <ul>
                          <li><Link to="/">Lineare</Link></li>
                          <li><Link to="/">Quadratic</Link></li>
                          <li><Link to="/">Polynomials</Link></li>
                        </ul>
                      </div>
                    </li> */}
                  </ul>
                </div>
              </li>
              <li><a>Squares Regression</a>
                <div class="sub-menu-1">
                  <ul>
                    <li><Link to="/Linear-Regression">Linear Regression</Link></li>
                    <li><Link to="/Polynomials-Regression">Polynomials Regression</Link></li>
                    {/* <li><Link to="/Mutiple-Regression">Mutiple Regression</Link></li> */}
                  </ul>
                </div>
              </li>
            </ul>
          </div>
            {/* <Route path="/" component={home} ></Route> */}
            <Route path="/Bisection" component={Bisection} ></Route>
            <Route path="/False-position" component={Falseposition} ></Route>
            <Route path="/One-point" component={Onepoint} ></Route>
            <Route path="/Newton_rapson" component={NewtonRaph} ></Route>
            <Route path="/Secant" component={Secant} ></Route>
            <Route path="/Cramer" component={Cramer} ></Route>
            <Route path="/Gauss-eliminate" component={Gauss}></Route>
            <Route path="/Gauss-Jordan" component={Jordan}></Route>
            <Route path="/LU-Decomposion" component={LU}></Route>
            <Route path="/Cholesky-Decomposition" component={Cholesky}></Route>
            <Route path="/Jacobi-Iteration" component={Jacobi}></Route>
            <Route path="/Gauss-Seidel" component={Seidel}></Route>
            <Route path="/Conjugate-Gradient" component={Gradient}></Route>
            <Route path="/Newton's divided-differences" component={Newton}></Route>
            <Route path="/Lagrange polynomials" component={Lagrange}></Route>
            <Route path="/Spline interpolation" component={Spline}></Route>
            <Route path="/Linear-Regression" component={Linear}></Route>
            <Route path="/Polynomials-Regression" component={Polynomial}></Route>
            <Route path="/Mutiple-Regression" component={MultipleLinear}></Route>
        </body>
      </div>

      {/* <Switch>
        <Route path="/" component={home}>
          <Users />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch> */}
    </Router>
  );
}

// function Home() {
//   return <h1>NUMER PROJECT</h1>;
// }

// function About() {
//   return <h2>About</h2>;
// }

// function Users() {
//   return <h2>Us1231231321321321ers</h2>;
// }








// import React from "react";
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link
// } from "react-router-dom";

// export default function App() {
//   return (
//     <Router>
//       <div>
//         <nav>
//           <ul>
//             <li>
//               <Link to="/">Home</Link>
//             </li>
//             <li>
//               <Link to="/about">About</Link>
//             </li>
//             <li>
//               <Link to="/users">Users</Link>
//             </li>
//           </ul>
//         </nav>

//         <Switch>
//           <Route path="/about">
//             <About />
//           </Route>
//           <Route path="/users">
//             <Users />
//           </Route>
//           <Route path="/">
//             <Home />
//           </Route>
//         </Switch>
//       </div>
//     </Router>
//   );
// }

// function Home() {
//   return <h2>Home</h2>;
// }

// function About() {
//   return <h2>About</h2>;
// }

// function Users() {
//   return <h2>Users</h2>;
// }

import { Outlet, Link } from "react-router-dom";
/* (Контекст) У дочірніх елементах контексту зазначаємо імпорт самого контексту,
   оголошеного як export у файлі Арр  */
import { UserContext } from './App';
import { useCallback, useContext, useRef, useState } from "react";   // також імпортуємо хук контексту

const url = "https://localhost:7038";
const avatarPath = url + "/img/avatars/";

const Layout = () => {
  /* (Контекст) одержуємо посилання, що їх провадить контекст (через .Provider value=...) */
  const { user, setUser } = useContext(UserContext);

  const logOut = useCallback(() => {
    setUser(null);
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
  });

  return (<>    
<nav className="navbar navbar-expand-md navbar-light bg-light">
  <div className="container-fluid">
    <Link className="navbar-brand" to="/">Boo-King</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div className="navbar-nav">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/admin">Admin Page</Link>
      </div>
    </div>
    {!!user && <>
        <img src={avatarPath + (user.avatarUrl ?? "no-avatar.png")} alt="avatar" className="size-40 rounded-circle" />
        <button type="button" className="btn btn-outline-secondary" 
          onClick={logOut}><i className="bi bi-box-arrow-right"></i></button>
      </>}
    {!!user || <button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal"
        data-bs-target="#authModal"><i className="bi bi-person-check-fill"></i></button>}
  </div>
  
</nav>
<div className="sub-header">
     <h2>Ваш найкращий вибір</h2>
     <h3>Це ми</h3>
 </div>
<div className="container">
    <Outlet />
</div>
<div className="spacer"></div>
<footer>
    &copy; 2024 IT Step University
</footer>
<AuthModal />
</>);
};

function AuthModal() {
  /* (Контекст) одержуємо посилання, що їх провадить контекст (через .Provider value=...) */
  const { setUser, setToken } = useContext(UserContext);

  /* (Форми) Для елементів форми створюємо хуки-стани, які є контролерами полів введення */
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [errorMessage, setErrorMessage] = useState("");
  const closeButtonRef = useRef();

  /* (Форми) Реалізуємо обробники подій зміни для полів форми */
  const onEmailChange = e => setEmail(e.target.value);
  const onPasswordChange = e => setPassword(e.target.value);

  const authClick = () => {
    /* (Форми) Коли підбиваємо підсумки форми - у хуках-змінних знаходяться актуальні значення полів */
    if(email === "") {
      setErrorMessage("Заповніть 'електронну пошту'");
      return;
    }
    if(password === "") {
      setErrorMessage("Заповніть 'пароль'");
      return;
    }
    
    fetch(`${url}/api/auth/token?email=${email}&password=${password}`)
    .then(r => {
        if (r.status != 200) {
          setErrorMessage("Вхід скасовано, перевірте введені дані");
        }
        else {
          setErrorMessage("");
          closeButtonRef.current.click();
          r.json().then(j => {
            if(j.user) {  
              setUser(j.user);
              window.localStorage.setItem('user', JSON.stringify(j.user));
              delete j.user;   // видаляємо поле user - залишається лише токен
            }            
            setToken(j);
            if(j) {  // одержаний токен зберігаємо у сховищі браузера
              window.localStorage.setItem('token', JSON.stringify(j));
            }
        });
        }
    });
  };  

  return <div className="modal fade" id="authModal" tabIndex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
          <h5 className="modal-title" id="authModalLabel">Автентифікація (вхід до сайту)</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={closeButtonRef}></button>
      </div>
      <div className="modal-body">
          <div className="row">
              <div className="input-group mb-3">
                  <span className="input-group-text" id="auth-Password-icon"><i className="bi bi-envelope-at"></i></span>
                  <input type="text" className="form-control" placeholder="Email"
                          aria-label="Email" aria-describedby="auth-email-icon" 
                          value={email} onChange={onEmailChange} />
              </div>
          </div>
          <div className="row">
              <div className="input-group mb-3">
                  <span className="input-group-text" id="auth-password-icon"><i className="bi bi-lock"></i></span>
                  <input type="password" className="form-control" placeholder="Пароль"
                          aria-label="Password" aria-describedby="auth-password-icon"
                          value={password} onChange={onPasswordChange} />
              </div>
          </div>
      </div>
      <div className="modal-footer">
        {errorMessage.length > 0 && <div className="alert alert-warning" role="alert">{errorMessage}</div>}
        <div className="spacer"></div>
        <button type="button" className="btn btn-primary" onClick={authClick}>Вхід</button>
      </div>
    </div>
  </div>
</div>;
}

export default Layout;

/* Токени авторизації.
Одна з головних задач фронтенда щодо токенів - це забезпечити
зберігання токену протягом його терміну придатності.
Самих засобів фронтенду може бути недостатньо, тому вживаються
засоби браузера - localStorage / sessionStorage та інші.
*/
/* Д.З. (Форми) Розробити форму реєстрації нового користувача
За зразок можна взяти форму з ASP-проєкту
*/

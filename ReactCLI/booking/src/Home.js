import {useState, useEffect, useCallback, useReducer} from 'react';
import { Link } from "react-router-dom";

/* (Контекст) У дочірніх елементах контексту зазначаємо імпорт самого контексту,
   оголошеного як export у файлі Арр  */
import { UserContext } from './App';
import { useContext } from "react";   // також імпортуємо хук контексту
   

const url = "https://localhost:7038";
const apiPath = url + "/api/category" ;
const photoPath = url + "/img/content/";

function reducer(state, action) {
  switch (action.type) {
    case 'loadCategories': {
      return {
        ...state,
        categories: action.payload
      };
    }
    case 'deleteCategory': {   // action.payload -- id to delete
      let newState = {...state};
      newState.categories.find(c => c.id == action.payload).deletedDt = new Date().toDateString();
      return newState;
    } 
    case 'restoreCategory': {   // action.payload -- id to restore
      let newState = {...state};
      newState.categories.find(c => c.id == action.payload).deletedDt = null;
      return newState;
    } 
  }
}

function Home() {
  // let [ctg, setCtg] = useState([]);
  const [state, dispatch] = useReducer(reducer, { categories: [] });

  /* (Контекст) одержуємо посилання, що їх провадить контекст (через .Provider value=...) */
  const { user, token } = useContext(UserContext);

  useEffect(() => {
    if(state.categories.length === 0) {
      loadCategories();
    }
  });

  const loadCategories = useCallback(() => {
    fetch(apiPath, {
      headers: (token ? {'Authorization': `Bearer ${token.id}`} : {})
    })
    .then(r => r.json())
    .then(j => dispatch({ type: 'loadCategories', payload: j }));
  }); 

  const editCardClick = useCallback( (category) => {
    console.log(category);
  });

  return (
    <div className="Home">
      <h1>Home</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {state.categories.map(c => <CategoryCard category={c} key={c.id} editCardClick={editCardClick} dispatch={dispatch} />)}
      </div>
      {user != null && user.role == "Admin" && <AdminCategoryForm reloadCategories={loadCategories} />}
    </div>
  );
}

function AdminCategoryForm( props ) {
  /* useCallback - хук, що дозволяє не створювати функцію повторно
     з кожним перезапуском  AdminCategoryForm() */
  const formSubmit = useCallback( e => {
    e.preventDefault();
    const form = e.target;
    let formData = new FormData(form);
    fetch(apiPath, {
        method: 'POST',
        body: formData
    }).then(r => {
        console.log(r);
        if (r.status == 201) {
            props.reloadCategories();
        }
        else {
            r.text().then(alert);
        }
    });
  });

  return <>
<hr/>
<form id="category-form" method="post" encType="multipart/form-data" onSubmit={formSubmit}>
    <div className="row">
        <div className="col">
            <div className="input-group mb-3">
                <span className="input-group-text" id="category-name"><i className="bi bi-person-vcard"></i></span>
                <input type="text" className="form-control"
                       placeholder="Назва" name="category-name"
                       aria-label="Category Name" aria-describedby="category-name"/>
                <div className="invalid-feedback">Ім'я не може бути порожнім</div>
            </div>
        </div>
        <div className="col">
            <div className="input-group mb-3">
                <span className="input-group-text" id="category-description"><i className="bi bi-file-text"></i></span>
                <input type="text" className="form-control"
                       name="category-description" placeholder="Опис"
                       aria-label="Description" aria-describedby="category-description"/>
                <div className="invalid-feedback">Опис не може бути порожнім</div>
            </div>
        </div>
    </div>

    <div className="row">
        <div className="col">
            <div className="input-group mb-3">
                <span className="input-group-text" id="category-slug"><i className="bi bi-link"></i></span>
                <input type="text" className="form-control" placeholder="Slug"
                       name="category-slug"
                       aria-label="Category Slug" aria-describedby="category-slug"/>
            </div>
        </div>
        <div className="col">
            <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="category-photo"><i className="bi bi-image"></i></label>
                <input type="file" className="form-control" name="category-photo" id="category-photo"/>
            </div>
        </div>
    </div>

    <div className="row">
        <div className="col">
            <button type="submit" className="btn btn-secondary"
                    name="category-button" value="true">
                Зберегти
            </button>
        </div>
    </div>
    <input type="hidden" name="category-id" value="" />
</form>
<hr/>
  </>;
}

function CategoryCard(props) {
  const { user, token } = useContext(UserContext);
  /* Д.З. Реалізувати відображення дати видалення категорії (сутності Category)
     у людино-зрозумілому форматі.
     ** Використати "інтелектуальну" форму - якщо дата сьогодні, то виводити лише час,
        якщо минуло менше 10 днів, то виводити "4 дні тому", інакше - саму дату */
  const delClick = useCallback( () => {
    if (window.confirm("Ви підтверджуєте видалення категорії?")) {
      fetch(`${apiPath}/${props.category.id}`, { 
        method: 'DELETE',
        headers: (token ? {'Authorization': `Bearer ${token.id}`} : {})
      }).then(r => {
          if (r.status < 400) {
              props.dispatch({type: 'deleteCategory', payload: props.category.id});
          }
          else {
              alert("Виникла помилка видалення");
          }
      })
    }
  });
  const restoreClick = useCallback( () => {
    if (window.confirm("Ви підтверджуєте відновлення категорії?")) {
      fetch(`${apiPath}?id=${props.category.id}`, { 
        method: 'RESTORE',
        headers: (token ? {'Authorization': `Bearer ${token.id}`} : {})
      }).then(r => {
          if (r.status < 400) {
              props.dispatch({type: 'restoreCategory', payload: props.category.id});
          }
          else {
              alert("Виникла помилка відновлення");
          }
      })
    }
  });
  const editClick = useCallback( () => {
    props.editCardClick(props.category);
  });
  return (<div className="col">
  <div className={"card  h-100 " + (props.category.deletedDt ? "card-deleted" : "")}>
      <Link to={"category/" + props.category.slug}>
          <img src={photoPath + props.category.photoUrl} className="card-img-top" alt="category"/>
          <div className="card-body">
            { !!props.category.deletedDt &&
                <i>Видалено {props.category.deletedDt}</i>
            }
            <h5 className="card-title">{props.category.name}</h5>
            <p className="card-text">{props.category.description}</p>
          </div>
      </Link>
{ user != null && user.role == "Admin" &&
    <div className="card-footer">
        { !!props.category.deletedDt &&
            <button className="btn btn-outline-success" onClick={restoreClick}>Restore</button>
        }
        { !props.category.deletedDt &&
            <button className="btn btn-outline-danger" onClick={delClick}>Del</button>
        } 
        <button className="btn btn-outline-warning" onClick={editClick}>Edit</button>
    </div>
}
  </div>
</div>);
}

export default Home;
/* /img/content/b726a974-d34f-48f2-9d0e-99cbe3b5661c.jpg
 props.category:
 {
    "id": "f0723199-da92-467c-a8c0-0f6ef7993e28",
    "name": "Готелі",
    "description": "Локації з великою кількістю номерів різного типу",
    "deletedDt": null,
    "photoUrl": "b726a974-d34f-48f2-9d0e-99cbe3b5661c.jpg",
    "slug": "Hotel"
  },

  Д.З. Реалізувати додавання локацій:
  - якщо користувач має роль адміністратора, то йому відображається форма додавання локації
  - дані форми передаються на бекенд асинхронно, у залежності від відповіді
   = виводиться помилка
   = оновлюється перелік локацій (без оновлення сторінки)



  */
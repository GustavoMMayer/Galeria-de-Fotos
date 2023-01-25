import React, {useEffect, useState, FormEvent} from "react";
import * as Photos from './services/photos';
import * as C from './App.styles';
import { Photo } from "./types/Photo";
import { PhotoItem } from "./components/PhotoItem";


const App = ()=>{

  const[loading, setLoading] = useState(false);
  const [upLoading, setUpLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [del, setDel] = useState<boolean>(false);

  useEffect(()=>{
    
    const getPhotos = async ()=>{
      setLoading(true);
      setPhotos(await Photos.getAll());
      setLoading(false);
    }
    getPhotos();
  },[del])

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>)=>{
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const file = formData.get('image') as File;
      if(file && file.size > 0){
        setUpLoading(true);

        let result = await Photos.insert(file);

        setUpLoading(false);

        if(result instanceof Error){
          alert(`${result.name} - ${result.message}`)
        }else{
          let newPhotoList = [...photos];
          newPhotoList.push(result);
          setPhotos(newPhotoList);
        }

    }
  };

  const onDelete = async (name: string) => {
    await Photos.deletePhoto(name);
    setDel(!del);
  };

  return(

    <C.Conatiner>
      <C.Area>
        <C.Header>Galeria de fotos</C.Header>

        <C.UploadForm method='POST' onSubmit={handleFormSubmit}>
          <input type="file" name='image'/>
          <input type='submit' value='Enviar'/>
          {upLoading && "Enviando ..."}
        </C.UploadForm>
      

        {loading &&
          <C.ScreenWarning>
            <div className="emoji">✋</div>
            <div>Carregando ... </div>
          </C.ScreenWarning>
        }

        {!loading && photos.length >0 &&

          <C.PhotoList>
            {photos.map((item, index)=>(
              
              <PhotoItem key={index} url={item.url} name={item.name} onDelete={onDelete}/>
            ))}
          </C.PhotoList>
        }

        {!loading && photos.length===0 &&
          <C.ScreenWarning>
          <div className="emoji">☹️</div>
          <div>Não há fotos cadastradas</div>
        </C.ScreenWarning>
        }

      </C.Area>
    </C.Conatiner>
  )
}
export default App;
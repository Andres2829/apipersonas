
import './App.css';
import { useEffect, useState } from 'react';
import {Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button,TextField} from '@material-ui/core'
import React from "react";
import {makeStyles} from '@material-ui/core/styles'
import { Edit, Delete, VisibilityOutlined } from '@material-ui/icons';
import axios from 'axios';
import { styled } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';


const baseUrl='https://apidijangoenersinc.onrender.com/api/personas/'

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },

  table: {
    position: 'absolute',
    width: 1400,
    height:200,
    background: 'linear-gradient(45deg, #6b8bfe 30%, #FF8E53 90%)',
    color: 'white',
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    border: 0,
    padding: theme.spacing(2, 4, 3),
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },

  body: {
    textAlign:'center',
    backgroundColor:'#6b8bfe',
    
  },



  iconos:{
    cursor: 'pointer'
  }, 
  inputMaterial:{
    width: '100%'
  }
}));

const MyButton = styled(Button)({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
});

function App() {
  const styles= useStyles();
  const [personas, setPersonas] = useState([]);

  const [modalVer, setModalVer]=useState(false);


  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);

  const [personaSeleccionada, setPersonaSeleccionada]=useState({
    tipodocumento: '',
    documento:'',
    nombres: '',
    apellidos:'',
    hobbie: ''
   
  })

  

 



  const handleChange=e=>{
    const {name, value}=e.target;
    setPersonaSeleccionada(prevState=>({
      ...prevState,
      [name]: value
    }))
    console.log(personaSeleccionada);
    
  }

  

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setPersonas(response.data.personas);
    })
  }


  const peticionPost=async()=>{
    await axios.post(baseUrl, personaSeleccionada)
    .then(response=>{
      setPersonas(personas.concat(response.data))
      abrirCerrarModalInsertar()
    })
  }


  const peticionPut=async()=>{
    await axios.put(baseUrl+personaSeleccionada.id, personaSeleccionada)
    .then(response=>{
      var dataNueva=personas;
      dataNueva.map(persona=>{
        if(personaSeleccionada.id===persona.id){
          persona.tipodocumento=personaSeleccionada.tipodocumento;
          persona.documento=personaSeleccionada.documento;
          persona.nombres=personaSeleccionada.nombres;
          persona.apellidos=personaSeleccionada.apellidos;
          persona.hobbie=personaSeleccionada.hobbie;
        }
      })
      setPersonas(dataNueva);
      abrirCerrarModalEditar();
    })
  }
  
  const peticionDelete=async()=>{
    await axios.delete(baseUrl+personaSeleccionada.id)
    .then(response=>{
      setPersonas(personas.filter(persona=>persona.id!==personaSeleccionada.id));
      abrirCerrarModalEliminar();
    })
  }



  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalVer=()=>{
    setModalVer(!modalVer);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }
  

  const seleccionarPersona=(persona, caso)=>{
    setPersonaSeleccionada(persona);
    (caso==='Editar')?abrirCerrarModalEditar():abrirCerrarModalEliminar()
  }

  const seleccionarPersonaver=(persona, caso)=>{
    setPersonaSeleccionada(persona);
    (caso==='Ver')?abrirCerrarModalVer():abrirCerrarModalEliminar()
  }











  useEffect(()=>{
     peticionGet();
  },[])

  const bodyInsertar=(
    <div className={styles.modal}>
      <h3>Agregar Nueva Persona</h3>
      <TextField name="tipodocumento" className={styles.inputMaterial} label="Tipodocumento" required onChange={handleChange}  />
      <br />
      <TextField name="documento" className={styles.inputMaterial} label="Documento" required onChange={handleChange}/>
      <br />
      <TextField name="nombres" className={styles.inputMaterial} label="Nombres" required onChange={handleChange}/>
      <br />
      <TextField name="apellidos" className={styles.inputMaterial} label="Apellidos" required onChange={handleChange} />
      <br />
      <TextField name="hobbie" className={styles.inputMaterial} label="Hobbies" required onChange={handleChange} />
      <br /><br />
      <div align="right">
      <Button color="primary" onClick={()=>peticionPost()}>Insertar</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEditar=(
    <div className={styles.modal}>
      <h3>Editar  Persona</h3>
      <TextField name="tipodocumento" className={styles.inputMaterial} label="Tipodocumento" onChange={handleChange} value={personaSeleccionada && personaSeleccionada.tipodocumento} />
      <br />
      <TextField name="documento" className={styles.inputMaterial} label="Documento" onChange={handleChange} value={personaSeleccionada && personaSeleccionada.documento}/>
      <br />
      <TextField name="nombres" className={styles.inputMaterial} label="Nombres" onChange={handleChange} value={personaSeleccionada && personaSeleccionada.nombres}/>
      <br />
      <TextField name="apellidos" className={styles.inputMaterial} label="Apellidos" onChange={handleChange} value={personaSeleccionada && personaSeleccionada.apellidos} />
      <br />
      <TextField name="hobbie" className={styles.inputMaterial} label="Hobbies" onChange={handleChange} value={personaSeleccionada && personaSeleccionada.hobbie} />
      <br /><br />
      <div align="right">
      <Button color="primary" onClick={()=>peticionPut()}>Editar</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      
      </div>
    </div>
  )

  const bodyVer=(
    <div className={styles.modal}>
      <h3>Ver  Persona</h3>
      <TextField disabled name="tipodocumento" className={styles.inputMaterial} label="Tipodocumento"   value={personaSeleccionada && personaSeleccionada.tipodocumento} />
      <br />
      <TextField disabled name="documento" className={styles.inputMaterial} label="Documento"  value={personaSeleccionada && personaSeleccionada.documento}/>
      <br />
      <TextField disabled name="nombres" className={styles.inputMaterial} label="Nombres"  value={personaSeleccionada && personaSeleccionada.nombres}/>
      <br />
      <TextField disabled name="apellidos" className={styles.inputMaterial} label="Apellidos"  value={personaSeleccionada && personaSeleccionada.apellidos} />
      <br />
      <TextField disabled name="hobbie" className={styles.inputMaterial} label="Hobbies" o value={personaSeleccionada && personaSeleccionada.hobbie} />
      <br /><br />
      <div align="right">
        <Button onClick={()=>abrirCerrarModalVer()}>Cancelar</Button>
      
      </div>
    </div>
  )




  const bodyEliminar=(
    <div className={styles.modal}>
      
      <p>Estás seguro que deseas eliminar la persona <b>{personaSeleccionada && personaSeleccionada.nombres}</b> ? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()} >Sí</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>

      </div>
    </div>
  )






  return (

    



    <div className={styles.body}>
      <br/>
      <h3>Prueba proceso de Selección Desarrollador Full Stack</h3>
      <h4>API Personas</h4>
      <MyButton  onClick={()=>abrirCerrarModalInsertar()}>Insertar</MyButton>
      <TableContainer component={Paper}>
        <Table className={styles.table}>
          <TableHead>
            <TableRow >
              <TableCell>Tipo de Documento</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Nombres</TableCell>
              <TableCell>Apellidos</TableCell>
              <TableCell>Hobbie</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {personas.map((persona)=>(
              <TableRow key={persona.id}>
              <TableCell>{persona.tipodocumento}</TableCell>
              <TableCell>{persona.documento}</TableCell>
              <TableCell>{persona.nombres}</TableCell>
              <TableCell>{persona.apellidos}</TableCell>
              <TableCell>{persona.hobbie}</TableCell>
              <TableCell>
              <VisibilityOutlined className={styles.iconos} onClick={()=>seleccionarPersonaver(persona, 'Ver')}/>
              &nbsp;&nbsp;&nbsp;
              <Edit className={styles.iconos} onClick={()=>seleccionarPersona(persona, 'Editar')}/>
                &nbsp;&nbsp;&nbsp;
                <Delete  className={styles.iconos} onClick={()=>seleccionarPersona(persona, 'Eliminar')}/>
              </TableCell>
              </TableRow>
              
            ))}
          </TableBody>
        </Table>
        
      </TableContainer>

      <Modal
     open={modalInsertar}
     onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
     </Modal>
     
     <Modal
     open={modalVer}
     onClose={abrirCerrarModalVer}>
        {bodyVer}
     </Modal>

     <Modal
     open={modalEditar}
     onClose={abrirCerrarModalEditar}>
        {bodyEditar}
     </Modal>

     <Modal
     open={modalEliminar}
     onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
     </Modal>

     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <h3>Realizado por: Andrés Cabrera</h3>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     <br/>
     

    
     

     
      
      
    </div>
  );
}

export default App;
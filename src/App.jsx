import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@fontsource/inter';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/joy/Box';
import { styled } from '@mui/joy/styles';
import Typography from '@mui/joy/Typography';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Table from '@mui/joy/Table';
import { useMediaQuery } from 'react-responsive'; // para checar o dispositivo

const Item = styled(Sheet)(({ theme }) => ({
  ...theme.typography['body-sm'],
  textAlign: 'center',
  fontWeight: theme.fontWeight.md,
  color: theme.vars.palette.text.secondary,
  border: '1px solid',
  borderColor: theme.palette.divider,
  padding: theme.spacing(1),
  borderRadius: theme.radius.md,
}));

function App() {

  const [count, setCount] = useState(0);
  const [descricaoItem, setDescricaoItem] = useState("");
  const [precoItem, setPrecoItem] = useState(0);
  const [qtdItem, setQtdItem] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const valorTotalItemFormatado = formatarMoeda(totalItem);
  const [listaItem, setListaItem] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [mobile, setMobile] = useState(window.innerWidth <= 768);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('listaItem');
    if (dadosSalvos) {
      setListaItem(JSON.parse(dadosSalvos));
    }
    calculaTotalItem();
  }, [precoItem, qtdItem]);

  const calculaTotalItem = () => {
    let total = precoItem * qtdItem;
    setTotalItem(total);
  }

  function formatarMoeda(valor) {
    const formatoMoeda = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return formatoMoeda.format(valor);
  }

  const handleInputChange = (event) => {
    // Remove todos os caracteres não numéricos e converte para um número
    const novoValor = parseFloat(event.target.value.replace(/[^0-9.]/g, ''));
    // Verifica se o valor é um número válido
    if (!isNaN(novoValor)) {
      setPrecoItem(novoValor);
    }
  };

  const adicionarItem = () => {
    const novaLista =  [...listaItem, {descricaoItem: descricaoItem, precoItem: precoItem, qtdItem: qtdItem, totalItem: totalItem}];
    setListaItem(novaLista);
    localStorage.setItem('listaItem', JSON.stringify(novaLista));
    setDescricaoItem("");
    setPrecoItem("");
    setQtdItem(0);
    setTotalItem(0);
  }

  const deletaItem = (descricao) => {
    const novaLista = listaItem.filter(item => item.descricaoItem != descricao);
    setListaItem(novaLista);
    localStorage.setItem('listaItem', JSON.stringify(novaLista));
  }

  return (
    
    <Stack>

    <Stack
      className="add_item"
      direction={isMobile? "column": "row"}
      alignContent={'center'} justifyContent={'center'}
      paddingBottom={"50px"}>
      <Stack mr={"10px"}>
        {/* <div>
          <p>Está no mobile? {isMobile ? 'Sim' : 'Não'}</p>
        </div> */}
        <Typography level="h4">Descrição</Typography>
        <Input placeholder="Descrição" 
          value={descricaoItem} 
          onChange={(e)=>{setDescricaoItem(e.target.value)}} />
      </Stack>

      <Stack mr={"10px"}>
        <Typography level="h4">Preço</Typography>
        <Input type='number' placeholder="Preço"
          value={precoItem}
          onChange={(e)=>{setPrecoItem(e.target.value)}} />
      </Stack>

      <Stack mr={"10px"}>
        <Typography level="h4">Quantidade</Typography>
        <Input type='number' placeholder="Quantidade" 
          value={qtdItem}
          onChange={(e)=>{setQtdItem(e.target.value)}}
          />
      </Stack>
    </Stack>

      <Stack direction={"row"} alignContent={'center'} justifyContent={'center'}>
        <Typography level="h2">{valorTotalItemFormatado}</Typography>
      </Stack> 

      <Stack direction={'row'} alignContent={'center'} justifyContent={'center'} mb={"50px"} mt={"20px"}>
        <Button onClick={()=>adicionarItem()}>Adicionar</Button>
      </Stack>

      {
        isMobile?
        <Box sx={{ width: '100%' }}>
          <Stack spacing={2}>
            { listaItem.length > 0 && (
              listaItem.map((item)=>(
                <Item >{item.descricaoItem} - {item.qtdItem}</Item>
              ))
            )}
          </Stack>
        </Box>
        
        :
        <Stack
          maxWidth={"80%"}
          marginLeft={"auto"}
          marginRight={"auto"}
          direction={isMobile? "column": "row"}
          alignContent={'center'} justifyContent={'center'}
          paddingBottom={"50px"}>
          <Table>
            <thead>
              <tr>
                <th style={{ width: '50%' }}>Descrição</th>
                <th style={{ width: '25%' }}>QTD</th>
                <th tyle={{ width: '25%' }}>Preço</th>
                <th tyle={{ width: '25%' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              { listaItem.length > 0 && (
                listaItem.map((item)=>(
                  <tr>
                    <td>{item.descricaoItem}</td>
                    <td>{item.qtdItem}</td>
                    <td>{item.totalItem}</td>
                    <td><Button onClick={()=> deletaItem(item.descricaoItem)}>Del</Button></td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Stack>
      }



  </Stack>
  )
}

export default App

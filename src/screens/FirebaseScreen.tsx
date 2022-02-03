import React, {useEffect} from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';


type PedidoRes = {
    pedido:string,
    id_restaurant: number;
}


export const FirebaseScreen = () => {

    const [data, setData] = useState();
    const [rtData, setRtData] = useState([]);
    const [rtDataAceptados, setRtDataAceptados] = useState([]);
    const [rtDataRechazados, setRtDataRechazados] = useState([]);
    const [rtDataNuevo, setRtDataNuevo] = useState([]);

    const [pedido,setPedido] = useState('');
    const [idRes,setIdRes] = useState('');
    const [status,setStatus] = useState('0');

    const [isEdit,setIsEdit] = useState(false);

    const [keyPedido, setKeyPedido] = useState('');


    const loadData = async() =>{
        try {
            const pedidos = await firestore().collection('pedidos').get();
            setData(pedidos.docs);

        } catch (error) {
            console.log(error)
        }
    }
    
    
    const loadRtData = async () =>{
        let resId = '123';
        const suscriber = firestore().collection('pedidos').where("id_Restaurant", "==", resId).onSnapshot(querySnapshot => {

            const pedidosRT = [];
            const pedidosRT_Pedido_Nuevo = [];
            const pedidosRT_Pedido_Aceptado = [];
            const pedidosRT_Pedido_Rechazado = [];

            querySnapshot.forEach(documentSnapshot => {
                console.log(documentSnapshot.data().status.toString(), "tipo", typeof(documentSnapshot.data().status));
                switch (documentSnapshot.data().status.toString()) {
                    case '0' || 0 :
                        pedidosRT_Pedido_Nuevo.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id
                        });
                        console.log('entre 0');
                        break;
                    case '1' || 1:
                        pedidosRT_Pedido_Aceptado.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id
                        });
                        console.log('entre 1');
                        break;
                    case '2' || 2:
                        pedidosRT_Pedido_Rechazado.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id
                        });
                        console.log('entre 2');
                        break;
                    default:
                        break;
                }
                
                pedidosRT.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id
                });
                
            })

            setRtData(pedidosRT);
            setRtDataAceptados(pedidosRT_Pedido_Aceptado);
            setRtDataNuevo(pedidosRT_Pedido_Nuevo);
            setRtDataRechazados(pedidosRT_Pedido_Rechazado);
        })
    
    
       return () => suscriber()
    
    }

    const hacerPedido =  () => {
        
        try {
            firestore().collection('pedidos').add({
                Pedido: pedido,
                id_Restaurant: idRes,
                status: '0'
            });
            console.log("hecho");
            
        } catch (error) {
            console.log(error)
        }
        finally{
            setPedido('');
            setIdRes('');
        }
        
    };

    const editarPedido = () => {
        try {
            firestore().collection('pedidos').doc(keyPedido).update({
                Pedido: pedido,
                id_Restaurant: idRes,
                status: status
            })
            
        } catch (error) {
            console.log(error);
        }finally{
            setIsEdit(false); 
            setPedido('');
            setIdRes('');
            setStatus(''); 
            
        }


    }

    const rellenarInputs = (item) => {
        setIdRes(item.id_Restaurant.toString());
        setStatus(item.status.toString());
        setPedido(item.Pedido);
        setIsEdit(true);
        setKeyPedido(item.key);
    };

    const editar = (item) => {
        /*
        Alert.alert(
            "Eliminar",
            "Esta seguro que desea eliminarlo?",
            [
                {
                    text: 'Cancelar',
                    style:'cancel'
                },
                {
                    text:'Editar',
                    onPress: () => {
                        rellenarInputs(item);
                    }
                },
                {
                    text:"Eliminar",
                    onPress: () => {

                        firestore().collection('pedidos').doc(item.key).delete().then(() => {
                            Alert.alert(
                                "Eliminación exitosa",
                                "Tu producto ha sido eliminado con exito."
                            )
                        })
                       
                    }
                }
            ] 
        )*/

        Alert.alert(
            "Nuevo pedido",
            "Items: " + item.Pedido.substring(1,(item.Pedido.length-1)),
            [
                {
                    text: 'Cancelar',
                    style:'cancel'
                },
                {
                    text:'Aceptar',
                    onPress: () => {
                        firestore().collection('pedidos').doc(item.key).update({
                            Pedido: item.Pedido,
                            id_Restaurant: item.id_Restaurant,
                            status: 1
                        });
                    }
                },
                {
                    text:"Rechazar",
                    onPress: () => {
                        firestore().collection('pedidos').doc(item.key).update({
                            Pedido: item.Pedido,
                            id_Restaurant: item.id_Restaurant,
                            status: 2
                        });
                       
                    }
                }
            ] 
        )


    }

    useEffect(() => {
      loadData();
      loadRtData();
    }, []);
    

    
    const renderRTItem = ({item}) => {
        return (
            
            <View style={styles.pedidoContainer}>
                
                    
                    <View style={{width:'50%'}} >
                        <Text>
                            {"Pedido: " +item.Pedido}
                        </Text>  
                    </View>
                    <View style={{width:'50%'}}>
                        <Text>
                            {"Restaurante: "+item.id_Restaurant}
                        </Text>   
                    </View>  
    
            </View>
            
        )
    }

    const renderRTItemNuevo = ({item}) => {
        return (

            <TouchableOpacity 
            onPress={() => {editar(item)}}
                >
            <View style={styles.pedidoContainer}>
                
                    
                    <View style={{width:'50%'}} >
                        <Text>
                            {"Pedido: " +item.Pedido}
                        </Text>  
                    </View>
                    <View style={{width:'50%'}}>
                        <Text>
                            {"Restaurante: "+item.id_Restaurant}
                        </Text>   
                    </View> 
                     
            
            </View>
            </TouchableOpacity>
        )
    }
    
    
  return (
        <ScrollView >
            
            <View style={{alignContent:'center', alignItems:'center', marginTop:30}}>
             <TextInput
                placeholder='Pedido'
                value = {pedido}
                onChangeText={pedido => setPedido(pedido)}
                style={styles.input}
            />

            <TextInput
                placeholder='Id res'
                value = {idRes}
                onChangeText={idRes => setIdRes(idRes)}
                style={styles.input}
            />

           

            <TouchableOpacity
                onPress={isEdit ? editarPedido : hacerPedido}
            >
                <View style={{...styles.input, width:100, }}>
                    <Text style={{textAlign:'center'}}>{ isEdit ? 'Editar' : 'Registrar pedido'}</Text>
                </View>
            </TouchableOpacity>
            </View>
            
          
        <Text style={styles.title}>
              Pedidos Nuevos
        </Text>

        <FlatList
            data={rtDataNuevo}
            renderItem={renderRTItemNuevo}
            keyExtractor={item => item.key}
          /> 

        <Text style={styles.title}>
              Pedidos Aceptados
        </Text>

        <FlatList
            data={rtDataAceptados}
            renderItem={renderRTItem}
            keyExtractor={item => item.key}
          />

        <Text style={styles.title}>
              Pedidos Rechazados
        </Text>

        <FlatList
            data={rtDataRechazados}
            renderItem={renderRTItem}
            keyExtractor={item => item.key}
          />

        <Text style={styles.title}>
              Pedidos RT
        </Text>

        <FlatList
            data={rtData}
            renderItem={renderRTItem}
            keyExtractor={item => item.key}
          />


        
  

        </ScrollView>
  )
};


const styles = StyleSheet.create({
    container:{
        height: 300,
        marginTop:20,
    },

    containerGlobal:{
        alignItems:'center',
        justifyContent:'center',
    },

    pedidoContainer:{
        alignItems:'center',
        justifyContent:'center',
        height: 50,
        marginHorizontal:40,
        backgroundColor:'#C9C9C9',
        borderColor:'black',
        borderBottomWidth:1,
        opacity:0.8,
        color: 'black',
        flexDirection:'row'
    },
    title:{
        textAlign:'center',
        fontSize:20,
        
    },
    input:{
        backgroundColor:'rgba(255,255,255,0.5)',
        borderRadius:10,
        marginBottom:20,
        borderWidth:1,
        textAlign:'center',
        width:250,
        fontSize:20
    }
})
import React,{useEffect,useState} from 'react'
import { View,StyleSheet,Text, TouchableOpacity,Image, SafeAreaView,Linking} from 'react-native'
import Constants from 'expo-constants'
import { Feather,FontAwesome} from '@expo/vector-icons'
import {useNavigation,useRoute} from '@react-navigation/native'
import {RectButton} from 'react-native-gesture-handler'
import Routes from '../../routes'
import api from '../../services/api'
import * as MailComposer from 'expo-mail-composer';


interface Params{
    point_id:number;

}

interface data{
    point:{
        image:string;
        nome:string;
        email:string;
        whatsapp:string;
        cidade:string;
        uf:string;
    }
    items:{
        titulo:string
    }[]
}


const Detail =() =>{

    const Route = useRoute()
    console.log(Route.params)
    const [data,setData] =useState<data>({} as data)


const routeParams = Route.params as Params

    const navegar = useNavigation();

    useEffect(()=>{
        api.get(`points/${routeParams.point_id}`).then(response=>{
           setData(response.data)
        })
    },[])

    function navegaDevolta(){
        navegar.goBack();
 
   }

   function composeMail(){
       MailComposer.composeAsync({
           subject:'Interesse na coleta de residuos',
           recipients: [data.point.email],
       })
   }

   function HandlerWthasapp(){
       Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text="Tenho interesse na coleta"`)

   }

   if(!data.point){
       return null;
   }

    return (
     <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
     <TouchableOpacity onPress={navegaDevolta}>
            <Feather name="arrow-left" size={20} color="#34cb79"/>

        </TouchableOpacity>

        <Image style={styles.pointImage} source={{uri:data.point.image}}/>
        
       <Text style={styles.pointName}>{data.point.nome}</Text>
    <Text style={styles.pointItems}>{data.items.map(item=>item.titulo).join(', ')}</Text>

        <View style={styles.address}>
    <Text style={styles.addressTitle}>{data.point.cidade}</Text>
           <Text style={styles.addressContent}>{data.point.uf}</Text>
        </View>
    </View>
    <View style={styles.footer}>

    <RectButton style={styles.button} onPress={HandlerWthasapp}>
      <FontAwesome name="whatsapp" size={20} color="#fff"/>
      <Text style={styles.buttonText}>Whatsapp</Text>
    </RectButton>

    <RectButton style={styles.button} onPress={composeMail}>
      <Feather name="mail" size={20} color="#fff"/>
      <Text style={styles.buttonText}>Email</Text>
    </RectButton>
    </View>
    </SafeAreaView>

    
    
    
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      paddingTop: 20,
    },
  
    pointImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
      borderRadius: 10,
      marginTop: 32,
    },
  
    pointName: {
      color: '#322153',
      fontSize: 28,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    pointItems: {
      fontFamily: 'Roboto_400Regular',
      fontSize: 16,
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    address: {
      marginTop: 32,
    },
    
    addressTitle: {
      color: '#322153',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    },
  
    addressContent: {
      fontFamily: 'Roboto_400Regular',
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: '#999',
      paddingVertical: 20,
      paddingHorizontal: 32,
      paddingBottom:0,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    
    button: {
      width: '48%',
      backgroundColor: '#34CB79',
      borderRadius: 10,
      height: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      marginLeft: 8,
      color: '#FFF',
      fontSize: 16,
      fontFamily: 'Roboto_500Medium',
    },
  });

export default Detail
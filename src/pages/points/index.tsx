import React,{useState,useEffect,} from 'react'
import { View, StyleSheet, TouchableOpacity, Text,Image, ScrollView,Alert} from 'react-native'
import  Constants from 'expo-constants'
import { Feather} from '@expo/vector-icons'
import {useNavigation,useRoute} from '@react-navigation/native'
import MapView, {Marker} from 'react-native-maps'
import {SvgUri} from 'react-native-svg'
import api from '../../services/api'
import * as Location from 'expo-location'

interface item{
  id:number;
  titulo:string;
  image_url:string
}

interface point{
  id:number;
  nome:string;
  image:string;
  latitude:number;
  longitude:number;
  
}

interface params{
  uf:string;
  cidade:string
}


const Points =() =>{


 
   const rotas = useRoute()
   const routeParams =  rotas.params as params;
   const [item,setItem] =useState<item[]>([])
   const [itemSelecionado,setItemSelecionado] =useState<number[]>([])
   const [posicaoInicial,setPosicaoInicial] =useState<[number,number]>([0,0])
   const [points,setPoints] =useState<point[]>([])
   const navegar = useNavigation();

   useEffect(()=>{
     async function LoadPosition(){

      const{ status} = await Location.requestPermissionsAsync();
      
       if(status !=='granted'){
          Alert.alert('Oooops...','precisamos de  sua perimissão para obter a localização')
          return
       }

       const location =await Location.getCurrentPositionAsync();

       const {longitude,latitude} = location.coords;

       console.log(longitude,latitude)

        setPosicaoInicial([
          latitude,
          longitude
        ])

     }

     LoadPosition();

   },[])

   useEffect(()=>{
     api.get('/').then(response =>{
       setItem(response.data)

     })
   },[])

   useEffect(()=>{
     api.get('points',{
       params:{
       cidade:routeParams.cidade,
       uf:routeParams.uf,
       items:itemSelecionado
       },

     }).then(response =>{
       setPoints(response.data)
       console.log(response.data)

     })
   }, [itemSelecionado])
 
 
   function navegaDevolta(){
       navegar.goBack();

  }

  function navegaParaDetail(id: number){
      navegar.navigate('Detail',{point_id:id});
  }

  function itemSelect(id: number){

    const jaSelecionado =itemSelecionado.findIndex(item=>item===id)
    
   

    if(jaSelecionado>=0){
        const itemFiltrado =itemSelecionado.filter(item=>item !==id)
        setItemSelecionado(itemFiltrado)
    }else{

    setItemSelecionado([...itemSelecionado,id])
    }
}



    return(
    <>
    <View style={styles.container}>
        <TouchableOpacity onPress={navegaDevolta}>
            <Feather name="arrow-left" size={20} color="#34cb79"/>

        </TouchableOpacity>
        <Text style={styles.title}>Bem vindo</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta</Text>
 
        <View style={styles.mapContainer}>
           {posicaoInicial[0] !==0 && (
              <MapView 
              style={styles.map} 
               
              initialRegion={{
                  latitude: posicaoInicial[0],
                  longitude:posicaoInicial[1],
                  latitudeDelta: 0.014,
                  longitudeDelta:0.014
                  
              }}
              >
              {points.map(point=>(
                <Marker 
                key={String(point.id)}
                style={styles.mapMarker}
                onPress={()=>navegaParaDetail(point.id)}
                coordinate={{
                    
    
                    latitude:point.latitude,
                    longitude:point.longitude
    
                }}>
    
                <View style={styles.mapMarkerContainer}>
                 <Image
                  style={styles.mapMarkerImage}
                  source={{uri:point.image}}/>
                  <Text style={styles.mapMarkerTitle}>{point.nome}</Text>
                   </View> 
    
                </Marker>
              ))}
              </MapView>
           )}

        </View>
    </View>

    <View style={styles.itemsContainer}>
        <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal:10}}>
          {item.map(items=>(
             <TouchableOpacity  
             key={String(items.id)} 
             style={[
               styles.item,
               itemSelecionado.includes(items.id)? styles.selectedItem:{}
          
              ]} 
             onPress={()=>itemSelect(items.id)}
             activeOpacity={0.7}>
             <SvgUri width={42} height={42} uri={items.image_url}/>
          <Text style={styles.itemTitle}>{items.titulo}</Text>
         </TouchableOpacity>
         
          ))}

      
      </ScrollView>
    </View>
    </>
    
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });

export default Points
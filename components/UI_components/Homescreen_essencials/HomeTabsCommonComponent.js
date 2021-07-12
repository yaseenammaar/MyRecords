import React, {useEffect, useRef, useState} from 'react';
import {Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,Image} from "react-native";
import {styles} from "../../../styles/globalStyle";
import {AntDesign, Entypo, FontAwesome5} from "@expo/vector-icons";
import {Button, Caption, Searchbar, Subheading} from "react-native-paper";
import * as lang from "../../../translations/lang.json";
import HomeTable from "./HomeTable";
import storeObject from "../../../store/store";
import {FabBtn} from "../Buttons";
import RBSheet from "react-native-raw-bottom-sheet";
import RadioButtonRN from "radio-buttons-react-native";
import filterAlgo from "../../Logic_Repository/filterAlgo";
import sortAlgo from "../../Logic_Repository/sortAlgo";
import homeScreenSearch from "../../Logic_Repository/searchLibrary/homeScreenSearch";
import Colors from "../../../constants/Colors";
import Modal from './Modal.js';
import dbObject from '../../database/db';
import * as Print from 'expo-print';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import Moment from 'moment';
import logoImage from '../../../assets/images/logo.jpg';
const logo = Image.resolveAssetSource(logoImage).uri



// rcvble-take=2 AND give=0

// payable-give=2 AND take=0


function HomeTabsCommonComponents(props) {

  /**
   * cardsData:    // cards data will contain data to be dispalyed in two cards on the top
   * [
   *    {
   *      title,
   *      amount
   *    },
   *    {
   *      title,
   *      amount
   *    }
   * ],
   *
   * searchBarData:  // datas for search bar component
   * {
   *   onPressPdf
   * },
   *
   * componentName: "dashboard" | "duePayable" | "gaveGot",
   *
   * tableData:
   * {
   *    sumArray: [],
   *    data: [],
   *    onPressEmptyTableAction
   * },
   *
   *  fabBtnData:
   *  {
   *    onPress,
   *    customFab,
   *
   *  }
   */
  const {navigation, componentName, cardsData, searchBarData, tableData, lan = 'english', fabBtnData} = props
  
  

  const [filterSelection, setFilterSelection] = useState('A')
  const [sortingSelection, setSortingSelection] = useState('Most Recent')

  const [isModalVisible, setModalVisibility] = useState(false)
  const [isGive, setIsGive] = useState(null)

  // const [sortingSelection, setSortingSelection] = useState('Most Recent')

  // 'give' ? 'Got / Payable' : 'Gave / Receivable'

  // if

  const showModal = async (index) => {
    // console.log('modal-',componentName)
    switch(componentName){
    case 'dashboard':
    index === 0 ? await getData('((give = 1 AND take = 0) OR (give = 2 AND take = 0))','Gave / Payable') : await getData('((give = 0 AND take = 1) OR (give = 0 AND take = 2))','Got / Receivable');
    // setModalVisibility(true );
    break;
    case 'duePayable':
    index === 0 ? await getData('give=2 AND take=0','Payable') : await getData('take=2 AND give=0','Receivable');
    // setModalVisibility(true );
    break;
    case 'gaveGot':
    index === 0 ? await getData('give=1 AND take=0','Gave') : await getData('take=1 AND give=0','Got');
    // setModalVisibility(true );
    break;
    

    }
    
    // console.log(isGive)
    
  };


  const hideModal = () =>{ setModalVisibility(false);
    setRecord(null)}



    // modal data

    const [mRecord, setRecord] = useState([])
    const [mGot, setGot] = useState(null)
    const [mGave, setGave] = useState(null)
    const [mNet, setNet] = useState(null)
    const [mNetNeg, setNetNeg] = useState(null)
    const [mCustomerCount, setmCustomerCount] = useState(null)
  
  
    
    const getData = async (key,value) => {
            let totalGot = 0
            let totalGave = 0
            
            // console.log(key)

            const record = await dbObject.getRecordByQueryString(storeObject.getCurrentBook(),key)
           
              // console.log('data data',record)
                  setRecord(record);
                  setModalVisibility(true );
                  setIsGive(value);
                  for (let entry of record) {
                      if (entry.take === 1) {
                          totalGot += entry.amount
                          // console.log("Gave Entry = ", entry.amount)
                      } else {
                          totalGave += entry.amount
                          // console.log("Take Entry = ", entry.amount)
                      }
                  }
                  
                  setGot(totalGot)
                  setGave(totalGave)
                  setNet(totalGave - totalGot)
                  if (totalGave - totalGot < 0) {
                      setNetNeg(1)
                  } else {
                      setNetNeg(0)
                  }
             
            
        
        }


  
  
  // modal data end

  // Pdf share

  const sharePdf = (url) => {
    Sharing.shareAsync(url)
}

  const Prints = 
  `<style>
  body {
    font-family: "lato", sans-serif;
  }
  

.datagrid {
	border-collapse: collapse;
}

.datagrid thead tr th {
	color: #949494;
	font-size: 11px;
	font-weight: normal;
	text-align: left;
	padding: 6px 8px;
	border: 1px solid #c9c9c9;
	background-image: linear-gradient(bottom, #EEEFF1 50%, #F9F9F9 54%);
	background-image: -moz-linear-gradient(bottom, #EEEFF1 50%, #F9F9F9 54%);
	background-image: -webkit-linear-gradient(bottom, #EEEFF1 50%, #F9F9F9 54%);
	background-image: -ms-linear-gradient(bottom, #EEEFF1 50%, #F9F9F9 54%);
	background-image: -webkit-gradient(linear, left bottom, left top, color-stop(0.5, #EEEFF1), color-stop(0.54, #F9F9F9)); 
}
.datagrid tbody tr {
	background: #fff;
}

.datagrid tbody tr td {
	padding: 6px 8px;
	border: 1px solid #c9c9c9;
}


.datagrid tbody tr td.cash {
	text-align: right;
}
  
  .container {
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 10px;
    padding-right: 10px;
  }
  
  h2 {
    font-size: 26px;
    margin: 20px 0;
    text-align: center;
  }
  h2 small {
    font-size: 0.5em;
  }
  
  .responsive-table li {
    border-radius: 3px;
    padding: 25px 30px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
  }
  .responsive-table .table-header {
    background-color: #95a5a6;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .responsive-table .table-row {
    background-color: #ffffff;
    box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.1);
  }
  .responsive-table .col-1 {
    flex-basis: 10%;
  }
  .responsive-table .col-2 {
    flex-basis: 40%;
  }
  .responsive-table .col-3 {
    flex-basis: 25%;
  }
  .responsive-table .col-4 {
    flex-basis: 25%;
  }
  @media all and (max-width: 767px) {
    .responsive-table .table-header {
      display: none;
    }
    .responsive-table li {
      display: block;
    }
    .responsive-table .col {
      flex-basis: 100%;
    }
    .responsive-table .col {
      display: flex;
      padding: 10px 0;
    }

    .responsive-table .col:before {
      color: #6c7a89;
      padding-right: 10px;
      content: attr(data-label);
      flex-basis: 50%;
      text-align: right;
    }
  }
    
    </style>

    <div id="demo">
        <img src="data:image/jpeg;base64,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
                                          KwhmRYAGA+CBB5pbgiCNm8Ko/C64V1T8gRJ5TBh+W7RYzwuuMWoBKtRVuAGbeF6+P7YnyOb0XHw/wBX7yl+no68Brk/zfoMXw3UCtTDILCpfYK4IyzMivRK6GC+U4Wopwsvg4Lk8kr8VrniWRApn/CSWaVnGi/qVVF6I2HjdO0zyOrZihxGwfUuLkxpW7ebvCKPwuuKhGPNFBs+Ar2JnwuuJGxRg4QoLNWDWZVDhHAcLaWzgsR1Ygpl2ENuHxfy7+bAmlY4iaDqJeoO/A/Il7wLyN+jwebYKPjYHUhQ6u9Ghs/2gWEYMj+mciA1BArUwADNgAr3gAF0CHiPjwCxNhQFsUvmYYOOz98drBJcPI6ondcwKMo/YcInGehGrRYuYWjC3M/R3ZECdhwdA2RuExqKcAixh6FtJdgaKxCfC65zrP2ESMeHwADzgaN7pzE0I2rAWJsL8Dm23HKrPzohdAlVOMIF2dErOAoC6iYwOyxleiiqFtBmzSrOs0YpeS1dvjsQXnkksrH7yu/OkgMAFa4pNhuoa6Xz35wyIBOJZ4zVzKtlPHyiix+V4uex43TtM8jqmeP/AIqYhZq6ctgxDE31VDiIhComEOmDubCwZe2UXYNONRPjiP5/aMtSB5QBg2levUojF6hwR+d2F7FaXWdc/dz679vEOnBcl5uvqtn/ANRjJVkaTbqNKqzhqo3fj5iacPToXsYU5GuyrKS4+/WMDygQLXxu8XgNQ/4dpv4xIe8qzBAAgRm7z08WY+y1LuqvZtv+WvrHIaqVn2Ij5CoWcLS4HTJXjTrAUjMXTvtTWBn7w6bLt32NYzc+zrCPWCC8nXivTAsEaUGmmr8dgQK1c994scP/AO75h87hVKaMrf8AKR//2Q=="
                                            border="0" alt="" width="58" height="auto" style="display: block;"/><br>
  <h1>Lekha Jokha Report</h1>
  <h5>`+Moment( new Date()).format('LLLL')   +`</h5>
  
  <table class="datagrid">
    <thead>
        <tr>
            <th>BOOK ID </th>
            <th>CONTACT</th>
            <th>NAME </th>
            <th>AMOUNT </th>
            <th>DATE</th>
            </tr>
            </thead>
            <tbody>
           
  
  
  `




    
//     <tr>
//       <td data-column="First Name">Andor</td>
//       <td data-column="Last Name">Nagy</td>
//       <td data-column="Job Title">Designer</td>
//       <td data-column="Twitter">@andornagy</td>
//     </tr>
//     <tr>
//       <td data-column="First Name">Tamas</td>
//       <td data-column="Last Name">Biro</td>
//       <td data-column="Job Title">Game Tester</td>
//       <td data-column="Twitter">@tamas</td>
//     </tr>
//     <tr>
//       <td data-column="First Name">Zoli</td>
//       <td data-column="Last Name">Mastah</td>
//       <td data-column="Job Title">Developer</td>
//       <td data-column="Twitter">@zoli</td>
//     </tr>
//     <tr>
//       <td data-column="First Name">Szabi</td>
//       <td data-column="Last Name">Nagy</td>
//       <td data-column="Job Title">Chief Sandwich Eater</td>
//       <td data-column="Twitter">@szabi</td>
//     </tr>
//   </tbody>
// </table>`

    
  const print = async (html) => {
    try {
      mContacts.forEach(element => {
        html = html+`
        <tr>
        <td>${element.bookid}</td>
        <td>${element.contact}</td>
        <td>${element.name}</td>
        <td>${element.netAmount}</td>
        <td>${element.lastupdated.substring(4, 15).toUpperCase() + " - " + element.lastupdated.substring(16, 21)}</td></tr>
     `
        

        
      });
      html=html+`</tbody></table></div>`
      console.log('contacts',mContacts)
      const { uri } = await Print.printToFileAsync({ 'html':html });
      
      if (Platform.OS === "ios") {
        await Sharing.shareAsync(uri);
        return uri;
      } else {
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (permission.granted) {
        //     const asset =await MediaLibrary.createAssetAsync(uri);
        //   alert(console.log(asset))
        //   return uri;
          const currentdate = new Date();
          const datetime = currentdate.getDate() + "_"
              + (currentdate.getMonth() + 1) + "_"
              + currentdate.getFullYear() + "-"
              + currentdate.getHours() + ":"
              + currentdate.getMinutes() + ":"
              + currentdate.getSeconds();
          const pdfName = `${uri.slice(
            0,
            uri.lastIndexOf('/') + 1
        )}Report_${datetime}.pdf`

        await FileSystem.moveAsync({
            from: uri,
            to: pdfName,
        })
        sharePdf(pdfName)
    }

   
      }  } catch (error) {
      console.error(error);
    }
  };

  // pdf share end


  // customer count
  const getCustomerCount = async (book_id) => {
   

      const record = await dbObject.getCustomerCount(book_id)
    console.log("View Report record outside if ", record[0]["COUNT(*)"])

    setmCustomerCount(record[0]["COUNT(*)"]?record[0]["COUNT(*)"]:0);
    

}

  // customer count end


  const refRBSheet = useRef();
  const sortingData = [
    {
      label: 'Most Recent'
    },
    {
      label: 'Highest Amount'
    },
    {
      label: 'By Name(A-Z)'
    },
    {
      label: 'Oldest'
    },
    {
      label: 'Least Amount'
    }
  ];


  const [mContacts, setContacts] = useState([])
  const totalCustomer = mContacts.length;
  const [filterSortedContacts, setFilterSortedContacts] = useState(null)
  const [searchText, setSearchText] = useState("")

  useEffect(() => {


    (async () => {

      await getCustomerCount(storeObject.getCurrentBook());
      if(tableData.data !== null) {
        setContacts(tableData.data)
        setFilterSortedContacts(tableData.data)
      }

    })();

    return () => {

      setContacts([])
      setFilterSortedContacts([])

    }


  }, [tableData.data]);


  return (


    <SafeAreaView style={[styles.wrapper, {paddingTop: 0, backgroundColor: "#fff"}]}>

      <View style={{padding: 10, backgroundColor: "#fff"}}>
        <View style={{flexDirection: "row"}}>
          {
            cardsData.map((data, index) => (
              <View key = {index} style={{flex: 1, margin: 5, elevation: 8, paddingVertical: 4, paddingHorizontal: 10, backgroundColor: "#fff", borderRadius: 5}}>
                <View>
                  <Text style={{fontSize: 13, fontWeight: "bold", color: "#303030", fontFamily: "monospace"}}>{data.title}</Text>
                  <Text style={index === 0? styles.giveAmountText: styles.takeAmountText}>₹{data.amount}</Text>
                </View>
                <TouchableOpacity  onPress={() => showModal(index)} style={{position: "absolute", top: 0, right: 0, margin: 10}}>
                  <Entypo name={"info-with-circle"} size={20}
                           color={"#303030"}/>
                </TouchableOpacity>

              </View>
            ))
          }

        </View>

        <Modal
    visible={isModalVisible}
    dismiss={hideModal}
    mRecord ={mRecord}
    nav={navigation}
    
    headerItem={[
      "Customer Details",
      isGive ,


    ]}
    // tableData = {tableData}
    // mTakeSum={tableData['sumArray']}
    //         lan={lan}
    //         navigation={navigation}
    //         data={mContacts}
    />

        <TouchableOpacity style={{
          flexDirection: "row",
          elevation: 8,
          borderRadius: 5,
          padding: 8,
          backgroundColor: "#fff",
          margin:2,
          marginBottom:0,
          alignItems: "center",
          justifyContent: "center",
        }}

        onPress={() => {
          navigation.navigate('ViewReportScreen', {all:1})
        }}
        >
          <AntDesign name={"folderopen"} size={20} style={{paddingHorizontal: 10}} color={Colors.primary}/>
          <Subheading>View Report</Subheading>
        </TouchableOpacity>

      </View>

        {/*backgroundColor: '#f4f0ec'*/}

      <View style={{flex: 1,marginTop: 0, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: "#f4f0ec"}}>

        {/* Search */}
        <View style={[styles.searchFilter, {borderRadius: 30, elevation: 8, backgroundColor: "#fff"}]}>
        <View style={{flex: 3,flexDirection: "column"}}>
          <Searchbar
          
            style={{ elevation: 0,borderRadius: 30}}
            placeholder={ lang[lan]['search']}
            allowFontScaling={false}
            onChangeText={text => SearchFilterFunction(text)}
          />
            <Text style={[styles.countInfo,{fontSize: 13,alignSelf: "center", fontWeight: "bold", color: "#78909c", fontFamily: "monospace",}]}>No. of Customers:{mCustomerCount}</Text>
</View>
          <TouchableOpacity style={styles.shopOpen} onPress={() => refRBSheet.current.open()}>
            <AntDesign style={styles.iSearchicon} name="filter" size={24} color="#4e54c8"/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shopOpen}  disabled={mContacts.length<=0}  onPress={()=>{print(Prints)}}>
            <AntDesign style={styles.iSearchicon} name="pdffile1" size={24} color="#4e54c8"/>
          </TouchableOpacity>
          
        
        </View>
        

        {
          tableData.data != null && tableData.data.length > 0 ?

            (

              mContacts.length > 0?
                <HomeTable
                  mTakeSum={tableData['sumArray']}
                  componentName = {componentName}
                  lan={lan}
                  navigation={navigation}
                  data={mContacts}
                />
                :
                <View style={{flex: 1, alignItems: "center", justifyContent: "center", padding: 10}}>
                  <Caption>No contacts found according to your search...</Caption>
                </View>
            )


            :
            
            
            

         (
              <View style={{flex: 1, alignItems: "center", justifyContent: "center", padding: 10}}>
                <Subheading style={{padding: 10, fontWeight: "bold"}}>{componentName === "dashboard" ? "Let's add your First Customer..." : "Let's add your First Transaction..."}</Subheading>
                <Button
                  icon="account-multiple-plus"
                  mode="outlined"
                  onPress={tableData?.onPressEmptyTableAction}
                >
                  {componentName === "dashboard" ? "Add New Customer" : "Add New Transaction"}
                </Button>
              </View>
            )


        }
      </View>

      {
        "customFab" in fabBtnData?
          fabBtnData.customFab
          :
          (
            <View style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              margin: 10
            }}>
              <FabBtn
                onPress={fabBtnData?.onPress}
              >
                <FontAwesome5 name="user-plus" size={22} color="#fff"/>
              </FabBtn>
            </View>
          )
      }

      <RBSheet
        ref={refRBSheet}

        closeOnDragDown={true}
        closeOnPressMask={true}
        height={510}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,.5)",

          },
          draggableIcon: {
            backgroundColor: "#4e54c8"
          },
          container: {
            backgroundColor: "#f1f2f3",
            paddingHorizontal: 10
          }
        }}
      >

        <Text style={[styles.normalText]}>Filter by</Text>

        <View style={[styles.row, {
          justifyContent: 'flex-start',
          backgroundColor: 'transparent',
          paddingHorizontal: 0,
          marginBottom: 12
        }]}>
          <TouchableOpacity style={[styleI.filterBtn, {backgroundColor: filterSelection === 'A' ? "#4e54c8" : 'white'}]}
                            onPress={() => setFilterSelection('A')}>
            <Text style={[{color: filterSelection === 'A' ? 'white' : 'grey'}]}>ALL</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styleI.filterBtn, {backgroundColor: filterSelection === 'R' ? "#4e54c8" : 'white'}]}
                            onPress={() => setFilterSelection('R')}>
            <Text style={[{color: filterSelection === 'R' ? 'white' : 'grey'}]}>Receivables</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styleI.filterBtn, {backgroundColor: filterSelection === 'P' ? "#4e54c8" : 'white'}]}
                            onPress={() => setFilterSelection('P')}>
            <Text style={[{color: filterSelection === 'P' ? 'white' : 'grey'}]}>Payables</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styleI.filterBtn, {backgroundColor: filterSelection === 'S' ? "#4e54c8" : 'white'}]}
                            onPress={() => setFilterSelection('S')}>
            <Text style={[{color: filterSelection === 'S' ? 'white' : 'grey'}]}>Settled</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.normalText, {marginBottom: 5}]}>Sort by</Text>


        <View style={[styles.container, {padding: 5, backgroundColor: 'white', borderRadius: 5}]}>
          <RadioButtonRN
            data={sortingData}
            selectedBtn={(e) => setSortingSelection(e.label)}
            activeColor={'#4e54c8'}
            circleSize={10}
            initial={getPickerInitial()}
          />
        </View>

        <View style={{
          position: 'absolute',
          left: '3%',
          bottom: '1%',
          width: '100%',
          height: 50,
          backgroundColor: "#4e54c8",
          borderRadius: 6,
          paddingHorizontal: 0
        }}>
          <TouchableOpacity
            style={{width: '100%', alignItems: 'center', height: 50, justifyContent: 'center'}}
            onPress={() => handleSortingAndFilter()}
          >
            <Text style={{color: 'white'}}>VIEW RESULT</Text>
          </TouchableOpacity>
        </View>

      </RBSheet>

    </SafeAreaView>

  );

  function getPickerInitial() {
    if (sortingSelection === 'Most Recent') {
      return 1
    } else if (sortingSelection === 'Highest Amount') {
      return 2
    } else if (sortingSelection === 'By Name(A-Z)') {
      return 3
    } else if (sortingSelection === 'Oldest') {
      return 4
    } else if (sortingSelection === 'Least Amount') {
      return 5
    }
  }

  async function handleSortingAndFilter() {

    // console.log(filterSelection)
    // console.log(sortingSelection)

    if (filterSelection === 'A' && sortingSelection === 'Most Recent') {
      setContacts(tableData.data)
      setFilterSortedContacts(tableData.data)
      //now close the bottom sheet
      refRBSheet.current.close()
      return
    }

    //first filter it
    const filter = await filterAlgo(tableData.data, filterSelection)

    //secondly sort it
    const sorted = await sortAlgo(filter, sortingSelection)

    setContacts(sorted)
    setFilterSortedContacts(sorted)

    if (searchText != null && searchText !== '') {
      await SearchFilterFunction(searchText)
    }

    //now close the bottom sheet
    refRBSheet.current.close()

  }

  async function SearchFilterFunction(text) {
    //passing the inserted text in textInput
    try {
      setSearchText(text)
      if (text != null && text !== '') {
        const filteredContacts = await homeScreenSearch(filterSortedContacts, text)
        setContacts(filteredContacts)
      } else {
        setContacts(filterSortedContacts)
      }
    } catch (e) {

      Alert.alert(e)

    }

  }
}

const styleI = StyleSheet.create({

  modalView: {
    margin: 20,
    flex: 1,
    backgroundColor: "white",
    borderRadius: 2,
    //   padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  oneLangCont: {
    elevation: 5,
    width: 160,
    justifyContent: 'flex-start',
    borderRadius: 6
  },

  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: 'white',
    elevation: 2
  },
  active: {
    backgroundColor: "#4e54c8"
  },

  searchBar: {
    backgroundColor: "#FFFFF0",
    borderRadius: 25,
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: "center",
    elevation: 5
  }
});

export default HomeTabsCommonComponents

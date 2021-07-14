import {SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../navigation/shared/header';
import dbObject from '../components/database/db'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import storeObject from "../store/store";
import HomeComponent from "../components/UI_components/Homescreen_essencials/HomeComponent";

function HomeScreen(props) {
    const {navigation} = props

    let lan = props.personals.currentLan


    const [mContacts, setContacts] = useState([])
    const [mGiveSum, setGiveSum] = useState(null)
    const [mTakeSum, setTakeSum] = useState(null)
    const [sumArr, setSumArr] = useState([])


    const [isModalVisible, setModalVisibility] = useState(false)

    useEffect(() => {


        /**
         *  Object {
            "address": null,
            "bookid": 1,
            "contact": "+916358963586",
            "lastupdated": "Sun Aug 09 2020 14:10:45 GMT+0530 (IST)",
            "loanYes": 0,
            "name": "Fg",
            "netAmount": null,
            "pAmount": null,
            "rAmount": null,
            "recordid": 2,
            "remoteid": null,
          },

         * */

        (async () => {

            dbObject.getSumOfAllRed(props.personals.currentBookId).then(function (res) {
                setGiveSum(res)
            })
                .catch(function (e) {
                    // console.log('homeScreen:: line 89' + e)
                })
            dbObject.getSumOfAllGreen(props.personals.currentBookId).then(function (res) {
                setTakeSum(res)
            })
                .catch(function (e) {
                    // console.log('homeScreen:: line 95' + e)
                })

            dbObject.getExistingContacts(props.personals.currentBookId).then(function (res) {
                // console.log("currentBookId ", props.personals.currentBookId)
                // console.log("All", res)
                setContacts(res)

            })

            //console.log("Contacts ", props.booksData.existingCustomers)


            if (props.booksData.existingCustomers) {
                const contactList = props.booksData.existingCustomers
                let tempSum = []
                for (let i = 0; i < contactList.length; i++) {
                    if (contactList[i].loanYes === 0) {
                        const s = await getUserSum(contactList[i].contact)
                        tempSum.push(s)

                    }
                }

                setSumArr(tempSum)

            }
        })();

        return () => {
            setContacts([])
        }


    }, [props.booksData.existingCustomers]);


    return (

        <SafeAreaView style={{flex: 1}}>
            <Header navigation={navigation}/>
            <HomeComponent key={navigation}
                           tableData={{
                                          sumArray: sumArr,
                                          data: mContacts,
                                          onPressEmptyTableAction: () => {
                                              navigation.navigate('ContactScreen')
                                          }
                                      }}
                           cardsData={[
                                          {
                                              title: "You will give",
                                              amount: mTakeSum
                                          },
                                          {
                                              title: "You will get",
                                              amount: mGiveSum
                                          }
                                      ]}

                           navigation={navigation}
                           lan={lan}
                           fabBtnData={{
                                          onPress: () => {
                                              navigation.navigate('ContactScreen')
                                          }
                                      }}
            />

        </SafeAreaView>

    );


    async function getUserSum(id) {
        let sumT
        let sumG
        sumT = await dbObject.getSumOfTakesContact(props.personals.currentBookId, id)
        sumG = await dbObject.getSumOfGavesContact(props.personals.currentBookId, id)
        return sumT - sumG

    }

}


const mapStateToProps = (state) => {
    const {personals, booksData} = state
    return {personals, booksData}
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        //all actions come here
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

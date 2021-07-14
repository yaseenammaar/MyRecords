class store {
    state = {
           existingCustomers:{},
           isLoggedIn:false,
           user:{},
           firstUseData: {},
           allActiveBooks:{},
        sumoftakes:0,
        records:{},
        contact:"",
           currentBook:0,
           currentBookData:{},
        isBookUpdated:false,
           currentLan:"english",
           currentCurrency:"INR",
           recordid:0,
           hideType:false,
           Gg:0,
           Rd:0
    }

    setGg(Gg){
        this.state.Gg = Gg
    }
    getGg(){
        return this.state.Gg
    }
    setRd(Rd){
        this.state.Rd = Rd
    }
    getRd(){
        return this.state.Rd;
    }

    setHideType(hide){
        this.state.hideType = hide
    }

    getHideType(){
        return this.state.hideType
    }

    setRecordId(recordid){
        this.state.recordid = recordid
    }
    getRecordId(){
        return this.state.recordid
    }

    setCurrentCurrency(currency){
        this.state.currentCurrency = currency
    }
    getCurrentCurrency(){
        return this.state.currentCurrency
    }


    setCurrentBookData(bookData){
        this.state.currentBookData = bookData
    }


    getCurrentBookData(){
        return this.state.currentBookData
    }


    setCurrentLan(lan){
        this.state.currentLan = lan
    }
    getCurrentLan(){
        return this.state.currentLan
    }

    getExistingCustomers() {
        return this.state.existingCustomers
    }

    setExistingCustomers(customers) {
        this.state.existingCustomers = customers
    }

    getIsLoggedIn() {
        return this.state.isLoggedIn
    }

    setIsLoggedIn(status) {
        this.state.isLoggedIn = status
    }

    getUser() {
        return this.state.user
    }

    setUser(user) {
       this.state.user = user
    }

    setSumOfTakes(sum){
        this.state.sumoftakes = sum
    }
    getSumOfTakes(){
        return this.state.sumoftakes
    }

    getRecords(){
        return this.state.records
    }

    setRecords(records){
        this.state.records = records
    }

    setContact(contact){
        this.state.contact = contact
    }
    getContact(){
        return this.state.contact
    }

    setCurrentBook(bookId){
        this.state.currentBook = bookId
    }

    getCurrentBook(){
        return this.state.currentBook
    }

    setBookUpdated(bookUpdated){
        this.state.isBookUpdated = bookUpdated
    }
    getBookUpdated(){
        return this.state.isBookUpdated
    }

    setFirstUseData(data){
        this.state.firstUseData = data
    }
    getFirstUseData(){
        return this.state.firstUseData
    }

    setAllActiveBooks(data){
        this.state.allActiveBooks = data
    }
    getAllActiveBooks(){
        return this.state.allActiveBooks
    }


}

const storeObject = new store()

export default storeObject

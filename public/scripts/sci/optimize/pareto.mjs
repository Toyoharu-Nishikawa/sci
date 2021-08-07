export const Pareto = class {
  constructor(data){
    this.data = []
    this.dataMap = new Map()
    this.paretoMap = new Map()
    this.currentId = 0
    
    if(data !==undefined){
      this.setData(data)
    }
  }
  setData(data){
    this.data = data
    this.dataMap = new Map(data.map((v,i)=>[i,v]))
    this.currentId = data.length-1
  }

  solveOne(dId, dValue){
    const paretoEntries = [...this.paretoMap.entries()]
    let addFlag = false
    for(let pEntry of paretoEntries){
      const pId = pEntry[0]
      const pValue = pEntry[1]
      const flags = pValue.map((v,i)=>v>dValue[i]?-1 : v<dValue[i]?1: 0)
      const equalityFlag = flags.every(v=>v==0)
      if(equalityFlag){
        addFlag = true 
        continue 
      }
      const inferiorFlag = flags.every(v=>v==-1||v==0)
      if(inferiorFlag){
        addFlag = false 
        break
      }
      const suferiorFlag = flags.every(v=>v==1||v==0)
      if(suferiorFlag){
        this.paretoMap.delete(pId)
        addFlag = true 
        continue
      }
      const nonInferiorFlag = flags.some(v=>v==1)
      if(nonInferiorFlag){
        addFlag = true 
        continue
      }
      else{
        addFlag = false 
        break 
      }
    }
    if(addFlag){
      this.paretoMap.set(dId, dValue) 
    }   
  } 
  solve(){
    const dataEntries = [...this.dataMap.entries()]
    for(let dEntry of dataEntries){
      const dId = dEntry[0]
      const dValue = dEntry[1]
      if(dId==0){
        this.paretoMap.set(dId, dValue)
        continue
      }
      this.solveOne(dId, dValue)
    }
  }
  addOneDataAndSolve(dValue){
    this.currentId++      
    const dId = this.currentId
    this.data.push(dValue) 
    this.dataMap.set(dId, dValue) 
    this.solveOne(dId, dValue)
  }
  addDataListAndSolve(dList){
    for(let dValue of dList){
      this.currentId++      
      const dId = this.currentId
      this.data.push(dValue) 
      this.dataMap.set(dId, dValue)      
      this.solveOne(dId, dValue)
    }
  }
  getParetoData(){
    const values = [...this.paretoMap.values()] 
    return values
  }
  getParetoDataIds(){
    const keys = [...this.paretoMap.keys()] 
    return keys
  }
  getParetoMap(){
    return this.paretoMap
  }
  getData(){
    return this.data
  }
  getDataMap(){
    return this.dataMap
  }

}



export const NonDominatedSorting = class {
   constructor(data){
    this.data = []
    this.dataMap = new Map()
    this.paretoMapList = []
    this.currentId = 0
    
    if(data !==undefined){
      this.setData(data)
    }
  }
  setData(data){
    this.data = data
    this.dataMap = new Map(data.map((v,i)=>[i,v]))
    this.currentId = data.length-1
  }
  discriminateOne(dId, dValue, paretoMap){
    let addFlag = false
    const deleteMap =new Map()
    for(let [pId, pValue] of paretoMap){
      const flags = pValue.map((v,i)=>v>dValue[i]?-1 : v<dValue[i]?1: 0)
      const equalityFlag = flags.every(v=>v==0)
      if(equalityFlag){
        addFlag = true 
        continue 
      }
      const inferiorFlag = flags.every(v=>v==-1||v==0)
      if(inferiorFlag){
        addFlag = false 
        break
      }
      const suferiorFlag = flags.every(v=>v==1||v==0)
      if(suferiorFlag){
        deleteMap.set(pId, pValue)
        addFlag = true 
        continue
      }
      const nonInferiorFlag = flags.some(v=>v==1)
      if(nonInferiorFlag){
        addFlag = true 
        continue
      }
      else{
        addFlag = false 
        break 
      }
    }
    const obj = {
      addFlag: addFlag,
      deleteMap: deleteMap,
    }
    return obj
  } 
  append(dId, dValue){
    const paretoMapList = this.paretoMapList
    const discriminateOne = this.discriminateOne

    const listMap = new Map([[dId, dValue]])
    for(let paretoMap of paretoMapList){
      for(let [id, value] of listMap){
        const {addFlag, deleteMap} = discriminateOne(id, value, paretoMap)
        if(addFlag){
          paretoMap.set(id, value)
          listMap.delete(id)
          for(let [deleteId, deleteValue] of deleteMap){
            listMap.set(deleteId, deleteValue)
            paretoMap.delete(deleteId)
          }
        }
      }
    }
    if(listMap.size>0){
      const paretoMap = new Map()
      for(let [id, value] of listMap){
        paretoMap.set(id, value)
        listMap.delete(id)
      }
      paretoMapList.push(paretoMap)
    }
  }
  solve(){
    const dataMap = this.dataMap 
    for(let [dId, dValue] of dataMap){
      this.append(dId, dValue)
    }
  }
  addOneDataAndSolve(dValue){
    this.currentId++      
    const dId = this.currentId
    this.data.push(dValue) 
    this.dataMap.set(dId, dValue) 
    this.append(dId, dValue)
  }
  addDataListAndSolve(dList){
    for(let dValue of dList){
      this.currentId++      
      const dId = this.currentId
      this.data.push(dValue) 
      this.dataMap.set(dId, dValue)      
      this.append(dId, dValue)
    }
  }

  getParetoMapList(){
    //return Map Array
    const list = this.paretoMapList
    return list
  }
  getParetoRankMap(){
    const rankMap = new Map()
    let rank = 0
    for(let paretoMap of this.paretoMapList){
      for(let id of paretoMap.keys()){
        rankMap.set(id, rank)
      }
      rank++
    }
    return rankMap 
  }
  getParetoDataList(){
    const list = this.paretoMapList
    const data = []
    for(let paretoMap of list){
      const values = [...paretoMap.values()]
      data.push(values)
    }
    return data 
  }
  getParetoDataIdList(){
    const list = this.paretoMapList
    const Ids = []
    for(let paretoMap of list){
      const values = [...paretoMap.keys()]
      Ids.push(values)
    }
    return Ids
  }
  getData(){
    return this.data
  }
  getDataMap(){
    return this.dataMap
  }
}

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
}

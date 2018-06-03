export const linEqGauss = (A, Va) =>{
  const nrc = Va.length

  const va = [].concat(Va)
  const m = A.map(a=>[].concat(a))
  const vx = [...Array(nrc)].fill(0)

  for (let i=0;i<nrc;i++){
    for(let j=i+1;j<nrc;j++){
      /* ピボット選択（初項の絶対値が最大の行を一番上に持ってくる*/
      if(m[i][i]*m[i][i]<m[j][i]*m[j][i]){
        let temp = va[i];
        va[i] = va[j];
        va[j] = temp;
        for(let k=i;k<nrc;k++){
          temp = m[i][k];
          m[i][k] = m[j][k];
          m[j][k] = temp;
        }
      }
    }
    /* i行目を1/m[i][i]倍 */
    const div = m[i][i];
    va[i] /=div;
    for(let j=i;j<nrc;j++)
      m[i][j] /= div;
    /* j行目からi行目のm[j][i]倍を引く */
    for(let j=i+1;j<nrc;j++){ 
      const unko = m[j][i];
      va[j] -= unko*va[i];
      for(let k=i;k<nrc;k++)
        m[j][k] -= unko*m[i][k];
    }
  }
  /* 後退代入により解を求める */
  vx[nrc-1] = va[nrc-1];
  for (let j=2;j<=nrc;j++){
    let sum = 0;
    for(let i = nrc-j+1;i<nrc;i++)
      sum += vx[i]*m[nrc-j][i];
    vx[nrc-j] = va[nrc-j] - sum;
  }
  return vx
}


export const area = {
  name: "area", title: "Area", type: "document",
  fields: [
    {name:"name",title:"Name",type:"string",validation:(r:any)=>r.required()},
    {name:"slug",title:"Slug",type:"slug",options:{source:"name"},validation:(r:any)=>r.required()},
    {name:"region",title:"Region",type:"string"},{name:"borough",title:"Borough",type:"string"},
    {name:"description",title:"Description",type:"text"},{name:"featured",title:"Featured",type:"boolean"},
    {name:"center",title:"Map centre",type:"object",fields:[{name:"lat",type:"number"},{name:"lng",type:"number"}]},
    {name:"marketData",title:"Market data",type:"object",fields:[
      {name:"averagePrice",type:"number"},{name:"averageRent",type:"number"},{name:"priceChange",type:"number"},{name:"rentChange",type:"number"},
      {name:"source",type:"string"},{name:"sourceUrl",type:"url"},{name:"period",type:"string"},{name:"updatedAt",type:"datetime"},
      {name:"status",type:"string",options:{list:["CURRENT","PROVISIONAL","ESTIMATE"]}}
    ]}
  ]
};

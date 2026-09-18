import {defineField,defineType} from "sanity";
export const homepage=defineType({name:"homepage",title:"Homepage",type:"document",fields:[
 defineField({name:"heroEyebrow",title:"Hero eyebrow",type:"string",initialValue:"LONDON PROPERTY · DIFFERENTLY"}),
 defineField({name:"heroTitle",title:"Hero title",type:"string",initialValue:"YOUR NEXT PROPERTY DECISION STARTS HERE."}),
 defineField({name:"heroIntro",title:"Hero introduction",type:"text",rows:2,initialValue:"London property. Strategic investment. Long-term thinking."}),
 defineField({name:"decisionTitle",title:"Decision section title",type:"string",initialValue:"A PROPERTY IS MORE THAN A NUMBER."}),
 defineField({name:"decisionBody",title:"Decision section body",type:"text",rows:3}),
 defineField({name:"primaryCtaLabel",title:"Primary CTA label",type:"string",initialValue:"EXPLORE PROPERTIES"}),
 defineField({name:"primaryCtaHref",title:"Primary CTA URL",type:"string",initialValue:"/properties"})
]});

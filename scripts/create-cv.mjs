// Generate a real, text-selectable, two-page, ATS-friendly CV with no runtime dependencies.
// PDF 1.4, standard Helvetica fonts, single-column content, no rasterized text.
import { writeFileSync } from "node:fs";

const WIDTH = 595, HEIGHT = 842, MARGIN = 45, CONTENT = WIDTH - 2*MARGIN;
const COLORS = {
  ink: [0.09, 0.16, 0.12],
  green: [0.10, 0.33, 0.21],
  muted: [0.28, 0.35, 0.30],
  line: [0.75, 0.80, 0.76]
};
const normalize = text => String(text)
  .replace(/[\u2010-\u2015]/g, "-")
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201c\u201d]/g, '"')
  .replace(/\u00d7/g, "x")
  .replace(/\u2192/g, "to")
  .replace(/[^\x20-\x7E]/g, " ");
const pdfEscape = text => normalize(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
const rgb = c => c.map(n=>n.toFixed(3)).join(" ");
const estimateWidth = (word, size, bold=false) => [...normalize(word)].reduce((n,c)=>{
  if("ilI1.,:;'| ".includes(c)) return n + size*.245;
  if("MW@%".includes(c)) return n + size*.79;
  if("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(c)) return n + size*(bold?.66:.63);
  return n + size*.53;
},0);

function page() {
  const commands=[];
  let y=HEIGHT-MARGIN;
  const write=(txt,x,y0,size=10,font="F1",color=COLORS.ink)=>{
    commands.push("BT /"+font+" "+size.toFixed(2)+" Tf "+rgb(color)+" rg 1 0 0 1 "+x.toFixed(1)+" "+y0.toFixed(1)+" Tm ("+pdfEscape(txt)+") Tj ET");
  };
  const rule=(y0)=>commands.push(rgb(COLORS.line)+" RG 0.65 w "+MARGIN+" "+y0.toFixed(1)+" m "+(WIDTH-MARGIN)+" "+y0.toFixed(1)+" l S");
  const wrap=(text,size=9.65,font="F1",x=MARGIN,maxWidth=CONTENT,lineHeight=size*1.45,color=COLORS.ink)=>{
    let line="",list=[];
    for(const word of normalize(text).split(/\s+/).filter(Boolean)) {
      const next=line?line+" "+word:word;
      if (estimateWidth(next,size,font==="F2")>maxWidth && line){list.push(line);line=word;}
      else line=next;
    }
    if(line)list.push(line);
    for(const l of list){write(l,x,y,size,font,color);y-=lineHeight;}
    return list.length;
  };
  const section=title=>{
    y-=11;rule(y+6);y-=17;
    write(title.toUpperCase(),MARGIN,y,9.1,"F2",COLORS.green);y-=17;
  };
  const role=(employer,date,title,bullets)=>{
    write(employer+"  |  "+date,MARGIN,y,12.2,"F2",COLORS.ink);y-=15;
    write(title,MARGIN,y,10.2,"F1",COLORS.green);y-=17;
    for(const item of bullets){
      write("-",MARGIN+1,y,9.7,"F1",COLORS.green);
      wrap(item,9.45,"F1",MARGIN+14,CONTENT-14,13.0,COLORS.ink);
      y-=3;
    }
    y-=12;
  };
  const footer=n=>{
    rule(45);write("EUGEN SKAROMNY  /  PRODUCT LEADERSHIP",MARGIN,29,8.5,"F1",COLORS.muted);
    write("PAGE "+n+" OF 2",WIDTH-MARGIN-58,29,8.5,"F1",COLORS.muted);
  };
  return {commands,write,rule,wrap,section,role,footer,get y(){return y;},set y(n){y=n;}};
}

function buildContent() {
  const a=page();
  a.write("EUGEN SKAROMNY",MARGIN,a.y,27,"F2",COLORS.ink);a.y-=23;
  a.write("PRODUCT LEADER  /  CONSUMER GROWTH  /  ENTERPRISE AI",MARGIN,a.y,10.8,"F2",COLORS.green);a.y-=19;
  a.write("Porto, Portugal  |  yauheni.skaromny@gmail.com  |  linkedin.com/in/skaromny",MARGIN,a.y,9.3,"F1",COLORS.muted);
  a.y-=18;
  a.section("Executive profile");
  a.wrap("Product leader with 11+ years of digital product and technology experience across consumer mobile, B2B SaaS, digital commerce and enterprise AI. Led a consumer app with 16M monthly active users and cross-functional delivery at scale. Today, focused on practical AI products, trustworthy knowledge workflows and product governance.",9.7,"F1",MARGIN,CONTENT,13.6);a.y-=8;
  a.section("Selected impact");
  a.wrap("16M MAU / 2.7M DAU - consumer app scale at MegaFon.",10,"F2",MARGIN,CONTENT,14.0);
  a.wrap("+1M MAU - expansion into a new customer segment.",10,"F1",MARGIN,CONTENT,14.0);
  a.wrap("+25% monthly visit frequency - following an in-app streaming integration.",10,"F1",MARGIN,CONTENT,14.0);
  a.wrap("72-person delivery organisation - cross-functional product execution.",10,"F1",MARGIN,CONTENT,14.0);
  a.section("Professional experience");
  a.role("VODAFONE GROUP","2024 - PRESENT","Digital Product Manager / Enterprise AI Product Lead",[
    "Established a portfolio approach for AI Workforce Augmentation, connecting AI agents, knowledge management, product governance and practical workflow adoption.",
    "Defined product evaluation methods for answer quality, task completion, adoption and user impact.",
    "Partner with engineering, architecture and business leaders to prioritise opportunities and move from experimentation toward repeatable delivery."
  ]);
  a.role("MEGAFON","JUN 2021 - NOV 2023","Head of Product / Consumer Mobile App",[
    "Led product strategy for an app serving 16M monthly active users and 2.7M daily active users, with a 72-person delivery organisation.",
    "Added more than 1M monthly active users through expansion into a new customer segment.",
    "In-app streaming integration increased monthly visit frequency by 25%; ARPU rose 15% during my tenure.",
    "Reorganised product delivery to reduce average production release lead time by two days."
  ]);
  a.footer(1);
  if(a.y<90)throw Error("Page 1 content overflow: y="+a.y);

  const b=page();
  b.write("EUGEN SKAROMNY  /  EXPERIENCE CONTINUED",MARGIN,b.y,14.0,"F2",COLORS.ink);b.y-=22;
  b.section("Professional experience, continued");
  b.role("MEGAFON","JUN 2019 - JUN 2021","Senior Product Manager / B2B SaaS & Digital Commerce",[
    "Unified fragmented B2B purchasing journeys in a single e-commerce platform; paid product orders increased 2.5x.",
    "Introduced enterprise single sign-on across services and improved feature delivery speed by 50% through process changes."
  ]);
  b.role("PINKMAN","NOV 2017 - MAR 2019","Group Head / Digital Delivery",[
    "Created and led the project management department: four PMs and an 18-person delivery organisation.",
    "Led work across 20+ digital projects in insurance, finance, e-commerce and corporate digital platforms.",
    "Led a no-code insurance platform enabling a new insurance programme to be configured and published within two hours."
  ]);
  b.role("CREATIVEPEOPLE","OCT 2015 - NOV 2017","Project Manager / Web & E-commerce",[
    "Improved delivery speed by 1.5x through planning and execution changes.",
    "Launched five real-estate e-commerce websites and supported four other web projects with design, engineering, analysis and QA teams."
  ]);
  b.section("Independent product practice");
  b.wrap("Needle - independent music discovery and playlist-building app: from social-video links to reviewed music matches and playlists. SMTHNG - physical candle brand. Numeral Crypt - experimental puzzle game.",9.7,"F1",MARGIN,CONTENT,13.5);
  b.section("Core expertise");
  b.wrap("Product strategy | Product discovery | Growth & engagement | B2B SaaS | AI product management | Agentic workflows | Portfolio governance | Product analytics | Team leadership | 0-to-1 product development",9.7,"F1",MARGIN,CONTENT,13.7);
  b.section("Education and languages");
  b.wrap("Belarusian State University - Bachelor's degree, Business, Management & Marketing (2009-2013).",9.7,"F1",MARGIN,CONTENT,13.7);
  b.wrap("English C1 | Russian native | Portuguese A2",9.7,"F1",MARGIN,CONTENT,13.7);
  b.footer(2);
  if(b.y<90)throw Error("Page 2 content overflow: y="+b.y);
  return [a.commands.join("\n"),b.commands.join("\n")];
}

function createPdf(pages) {
  const objs=[""];
  objs.push("<< /Type /Catalog /Pages 2 0 R >>");
  objs.push("<< /Type /Pages /Kids [5 0 R 7 0 R] /Count 2 >>");
  objs.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  objs.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  for(let i=0;i<2;i++){
    objs.push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 "+WIDTH+" "+HEIGHT+"] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents "+(i?8:6)+" 0 R >>");
    const bytes=Buffer.from(pages[i]+"\n","ascii");
    objs.push("<< /Length "+bytes.length+" >>\nstream\n"+pages[i]+"\nendstream");
  }
  let pdf="%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets=[0];
  for(let i=1;i<objs.length;i++){
    offsets.push(Buffer.byteLength(pdf,"binary"));
    pdf+=i+" 0 obj\n"+objs[i]+"\nendobj\n";
  }
  const xref=Buffer.byteLength(pdf,"binary");
  pdf+="xref\n0 "+objs.length+"\n0000000000 65535 f \n";
  for(let i=1;i<objs.length;i++)pdf+=String(offsets[i]).padStart(10,"0")+" 00000 n \n";
  pdf+="trailer\n<< /Size "+objs.length+" /Root 1 0 R >>\nstartxref\n"+xref+"\n%%EOF\n";
  return Buffer.from(pdf,"binary");
}

export function createCV(path) {
  const pages=buildContent();
  const pdf=createPdf(pages);
  if (pdf.length<4000)throw Error("CV PDF unexpectedly small");
  writeFileSync(path,pdf);
  return { bytes:pdf.length,pages:2 };
}

const fs = require('fs');
const path = require('path');

// words-002.json: ranks 251-500, IDs it_0251-it_0500
// A2 level vocabulary: verbs, nouns, adjectives

function makeVerb(id, rank, italian, english, group, irregular, conj, irregForms, examples, tags) {
  return {id, rank, lang:'it', italian, english,
    partOfSpeech:'verb', gender:null, plural:null,
    conjugationGroup:group, irregular,
    conjugations:conj, irregularForms:irregForms||null,
    examples, tags, needsReview:false};
}
function makeNoun(id, rank, italian, english, gender, plural, examples, tags, irr=false) {
  return {id, rank, lang:'it', italian, english,
    partOfSpeech:'noun', gender, plural, conjugationGroup:null, irregular:irr,
    conjugations:null, irregularForms:null, examples, tags, needsReview:false};
}
function makeAdj(id, rank, italian, english, plural, examples, tags) {
  return {id, rank, lang:'it', italian, english,
    partOfSpeech:'adjective', gender:'masculine', plural, conjugationGroup:null, irregular:false,
    conjugations:null, irregularForms:null, examples, tags, needsReview:false};
}
function makeAdv(id, rank, italian, english, examples, tags) {
  return {id, rank, lang:'it', italian, english,
    partOfSpeech:'adverb', gender:null, plural:null, conjugationGroup:null, irregular:false,
    conjugations:null, irregularForms:null, examples, tags, needsReview:false};
}
function makePrep(id, rank, italian, english, examples, tags) {
  return {id, rank, lang:'it', italian, english,
    partOfSpeech:'preposition', gender:null, plural:null, conjugationGroup:null, irregular:false,
    conjugations:null, irregularForms:null, examples, tags, needsReview:false};
}
function makeConj(id, rank, italian, english, examples, tags) {
  return {id, rank, lang:'it', italian, english,
    partOfSpeech:'conjunction', gender:null, plural:null, conjugationGroup:null, irregular:false,
    conjugations:null, irregularForms:null, examples, tags, needsReview:false};
}

// Full conjugation helper
function conj(presente, ppAux, pp, ppForms, imperfetto, futuro, condizionale, congiuntivo) {
  return {
    presente,
    passatoProssimo: {auxiliary:ppAux, pastParticiple:pp, ...ppForms},
    imperfetto,
    futuroSemplice: futuro,
    condizionale,
    congiuntivoPresente: congiuntivo
  };
}

const entries = [
  // 251-260: Common A2 verbs
  makeVerb('it_0251',251,'parlare','to speak','are',false,
    conj(
      {io:'parlo',tu:'parli',lui:'parla',noi:'parliamo',voi:'parlate',loro:'parlano'},
      'avere','parlato',{io:'ho parlato',tu:'hai parlato',lui:'ha parlato',noi:'abbiamo parlato',voi:'avete parlato',loro:'hanno parlato'},
      {io:'parlavo',tu:'parlavi',lui:'parlava',noi:'parlavamo',voi:'parlavate',loro:'parlavano'},
      {io:'parlerò',tu:'parlerai',lui:'parlerà',noi:'parleremo',voi:'parlerete',loro:'parleranno'},
      {io:'parlerei',tu:'parleresti',lui:'parlerebbe',noi:'parleremmo',voi:'parlereste',loro:'parlerebbero'},
      {io:'parli',tu:'parli',lui:'parli',noi:'parliamo',voi:'parliate',loro:'parlino'}
    ),null,['Parli italiano?'],['a1']),

  makeVerb('it_0252',252,'capire','to understand','ire',false,
    conj(
      {io:'capisco',tu:'capisci',lui:'capisce',noi:'capiamo',voi:'capite',loro:'capiscono'},
      'avere','capito',{io:'ho capito',tu:'hai capito',lui:'ha capito',noi:'abbiamo capito',voi:'avete capito',loro:'hanno capito'},
      {io:'capivo',tu:'capivi',lui:'capiva',noi:'capivamo',voi:'capivate',loro:'capivano'},
      {io:'capirò',tu:'capirai',lui:'capirà',noi:'capiremo',voi:'capirete',loro:'capiranno'},
      {io:'capirei',tu:'capiresti',lui:'capirebbe',noi:'capiremmo',voi:'capireste',loro:'capirebbero'},
      {io:'capisca',tu:'capisca',lui:'capisca',noi:'capiamo',voi:'capiate',loro:'capiscano'}
    ),null,['Non capisco.'],['a1']),

  makeVerb('it_0253',253,'trovare','to find','are',false,
    conj(
      {io:'trovo',tu:'trovi',lui:'trova',noi:'troviamo',voi:'trovate',loro:'trovano'},
      'avere','trovato',{io:'ho trovato',tu:'hai trovato',lui:'ha trovato',noi:'abbiamo trovato',voi:'avete trovato',loro:'hanno trovato'},
      {io:'trovavo',tu:'trovavi',lui:'trovava',noi:'trovavamo',voi:'trovavate',loro:'trovavano'},
      {io:'troverò',tu:'troverai',lui:'troverà',noi:'troveremo',voi:'troverete',loro:'troveranno'},
      {io:'troverei',tu:'troveresti',lui:'troverebbe',noi:'troveremmo',voi:'trovereste',loro:'troverebbero'},
      {io:'trovi',tu:'trovi',lui:'trovi',noi:'troviamo',voi:'troviate',loro:'trovino'}
    ),null,['Hai trovato le chiavi?'],['a1']),

  makeVerb('it_0254',254,'lasciare','to leave/let','are',false,
    conj(
      {io:'lascio',tu:'lasci',lui:'lascia',noi:'lasciamo',voi:'lasciate',loro:'lasciano'},
      'avere','lasciato',{io:'ho lasciato',tu:'hai lasciato',lui:'ha lasciato',noi:'abbiamo lasciato',voi:'avete lasciato',loro:'hanno lasciato'},
      {io:'lasciavo',tu:'lasciavi',lui:'lasciava',noi:'lasciavamo',voi:'lasciavate',loro:'lasciavano'},
      {io:'lascerò',tu:'lascerai',lui:'lascerà',noi:'lasceremo',voi:'lascerete',loro:'lasceranno'},
      {io:'lascerei',tu:'lasceresti',lui:'lascerebbe',noi:'lasceremmo',voi:'lascereste',loro:'lascerebbero'},
      {io:'lasci',tu:'lasci',lui:'lasci',noi:'lasciamo',voi:'lasciate',loro:'lascino'}
    ),null,['Lasciami stare.'],['a1']),

  makeVerb('it_0255',255,'sentire','to feel/hear','ire',false,
    conj(
      {io:'sento',tu:'senti',lui:'sente',noi:'sentiamo',voi:'sentite',loro:'sentono'},
      'avere','sentito',{io:'ho sentito',tu:'hai sentito',lui:'ha sentito',noi:'abbiamo sentito',voi:'avete sentito',loro:'hanno sentito'},
      {io:'sentivo',tu:'sentivi',lui:'sentiva',noi:'sentivamo',voi:'sentivate',loro:'sentivano'},
      {io:'sentirò',tu:'sentirai',lui:'sentirà',noi:'sentiremo',voi:'sentirete',loro:'sentiranno'},
      {io:'sentirei',tu:'sentiresti',lui:'sentirebbe',noi:'sentiremmo',voi:'sentireste',loro:'sentirebbero'},
      {io:'senta',tu:'senta',lui:'senta',noi:'sentiamo',voi:'sentiate',loro:'sentano'}
    ),null,['Come ti senti?'],['a1']),

  makeVerb('it_0256',256,'credere','to believe','ere',false,
    conj(
      {io:'credo',tu:'credi',lui:'crede',noi:'crediamo',voi:'credete',loro:'credono'},
      'avere','creduto',{io:'ho creduto',tu:'hai creduto',lui:'ha creduto',noi:'abbiamo creduto',voi:'avete creduto',loro:'hanno creduto'},
      {io:'credevo',tu:'credevi',lui:'credeva',noi:'credevamo',voi:'credevate',loro:'credevano'},
      {io:'crederò',tu:'crederai',lui:'crederà',noi:'crederemo',voi:'crederete',loro:'crederanno'},
      {io:'crederei',tu:'crederesti',lui:'crederebbe',noi:'crederemmo',voi:'credereste',loro:'crederebbero'},
      {io:'creda',tu:'creda',lui:'creda',noi:'crediamo',voi:'crediate',loro:'credano'}
    ),null,['Non ci credo!'],['a1']),

  makeVerb('it_0257',257,'portare','to bring/carry','are',false,
    conj(
      {io:'porto',tu:'porti',lui:'porta',noi:'portiamo',voi:'portate',loro:'portano'},
      'avere','portato',{io:'ho portato',tu:'hai portato',lui:'ha portato',noi:'abbiamo portato',voi:'avete portato',loro:'hanno portato'},
      {io:'portavo',tu:'portavi',lui:'portava',noi:'portavamo',voi:'portavate',loro:'portavano'},
      {io:'porterò',tu:'porterai',lui:'porterà',noi:'porteremo',voi:'porterete',loro:'porteranno'},
      {io:'porterei',tu:'porteresti',lui:'porterebbe',noi:'porteremmo',voi:'portereste',loro:'porterebbero'},
      {io:'porti',tu:'porti',lui:'porti',noi:'portiamo',voi:'portiate',loro:'portino'}
    ),null,['Porta il cane a passeggio.'],['a1']),

  makeVerb('it_0258',258,'pensare','to think','are',false,
    conj(
      {io:'penso',tu:'pensi',lui:'pensa',noi:'pensiamo',voi:'pensate',loro:'pensano'},
      'avere','pensato',{io:'ho pensato',tu:'hai pensato',lui:'ha pensato',noi:'abbiamo pensato',voi:'avete pensato',loro:'hanno pensato'},
      {io:'pensavo',tu:'pensavi',lui:'pensava',noi:'pensavamo',voi:'pensavate',loro:'pensavano'},
      {io:'penserò',tu:'penserai',lui:'penserà',noi:'penseremo',voi:'penserete',loro:'penseranno'},
      {io:'penserei',tu:'penseresti',lui:'penserebbe',noi:'penseremmo',voi:'pensereste',loro:'penserebbero'},
      {io:'pensi',tu:'pensi',lui:'pensi',noi:'pensiamo',voi:'pensiate',loro:'pensino'}
    ),null,['Cosa pensi?'],['a1']),

  makeVerb('it_0259',259,'chiamare','to call','are',false,
    conj(
      {io:'chiamo',tu:'chiami',lui:'chiama',noi:'chiamiamo',voi:'chiamate',loro:'chiamano'},
      'avere','chiamato',{io:'ho chiamato',tu:'hai chiamato',lui:'ha chiamato',noi:'abbiamo chiamato',voi:'avete chiamato',loro:'hanno chiamato'},
      {io:'chiamavo',tu:'chiamavi',lui:'chiamava',noi:'chiamavamo',voi:'chiamavate',loro:'chiamavano'},
      {io:'chiamerò',tu:'chiamerai',lui:'chiamerà',noi:'chiameremo',voi:'chiamerete',loro:'chiameranno'},
      {io:'chiamerei',tu:'chiameresti',lui:'chiamerebbe',noi:'chiameremmo',voi:'chiamereste',loro:'chiamerebbero'},
      {io:'chiami',tu:'chiami',lui:'chiami',noi:'chiamiamo',voi:'chiamiate',loro:'chiamino'}
    ),null,['Come ti chiami?'],['a1']),

  makeVerb('it_0260',260,'tornare','to return/come back','are',false,
    conj(
      {io:'torno',tu:'torni',lui:'torna',noi:'torniamo',voi:'tornate',loro:'tornano'},
      'essere','tornato',{io:'sono tornato',tu:'sei tornato',lui:'è tornato',noi:'siamo tornati',voi:'siete tornati',loro:'sono tornati'},
      {io:'tornavo',tu:'tornavi',lui:'tornava',noi:'tornavamo',voi:'tornavate',loro:'tornavano'},
      {io:'tornerò',tu:'tornerai',lui:'tornerà',noi:'torneremo',voi:'tornerete',loro:'torneranno'},
      {io:'tornerei',tu:'torneresti',lui:'tornerebbe',noi:'torneremmo',voi:'tornereste',loro:'tornerebbero'},
      {io:'torni',tu:'torni',lui:'torni',noi:'torniamo',voi:'torniate',loro:'tornino'}
    ),null,['Quando torni?'],['a1']),

  // 261-270: More A2 verbs
  makeVerb('it_0261',261,'tenere','to hold/keep','ere',true,
    conj(
      {io:'tengo',tu:'tieni',lui:'tiene',noi:'teniamo',voi:'tenete',loro:'tengono'},
      'avere','tenuto',{io:'ho tenuto',tu:'hai tenuto',lui:'ha tenuto',noi:'abbiamo tenuto',voi:'avete tenuto',loro:'hanno tenuto'},
      {io:'tenevo',tu:'tenevi',lui:'teneva',noi:'tenevamo',voi:'tenevate',loro:'tenevano'},
      {io:'terrò',tu:'terrai',lui:'terrà',noi:'terremo',voi:'terrete',loro:'terranno'},
      {io:'terrei',tu:'terresti',lui:'terrebbe',noi:'terremmo',voi:'terreste',loro:'terrebbero'},
      {io:'tenga',tu:'tenga',lui:'tenga',noi:'teniamo',voi:'teniate',loro:'tengano'}
    ),{futuro:'terrò/terrai/terrà/terremo/terrete/terranno'},['Tieni il ritmo!'],['a2']),

  makeVerb('it_0262',262,'vivere','to live','ere',false,
    conj(
      {io:'vivo',tu:'vivi',lui:'vive',noi:'viviamo',voi:'vivete',loro:'vivono'},
      'avere','vissuto',{io:'ho vissuto',tu:'hai vissuto',lui:'ha vissuto',noi:'abbiamo vissuto',voi:'avete vissuto',loro:'hanno vissuto'},
      {io:'vivevo',tu:'vivevi',lui:'viveva',noi:'vivevamo',voi:'vivevate',loro:'vivevano'},
      {io:'vivrò',tu:'vivrai',lui:'vivrà',noi:'vivremo',voi:'vivrete',loro:'vivranno'},
      {io:'vivrei',tu:'vivresti',lui:'vivrebbe',noi:'vivremmo',voi:'vivreste',loro:'vivrebbero'},
      {io:'viva',tu:'viva',lui:'viva',noi:'viviamo',voi:'viviate',loro:'vivano'}
    ),{pastParticiple:'vissuto'},['Vivo a Milano.'],['a1']),

  makeVerb('it_0263',263,'mangiare','to eat','are',false,
    conj(
      {io:'mangio',tu:'mangi',lui:'mangia',noi:'mangiamo',voi:'mangiate',loro:'mangiano'},
      'avere','mangiato',{io:'ho mangiato',tu:'hai mangiato',lui:'ha mangiato',noi:'abbiamo mangiato',voi:'avete mangiato',loro:'hanno mangiato'},
      {io:'mangiavo',tu:'mangiavi',lui:'mangiava',noi:'mangiavamo',voi:'mangiavate',loro:'mangiavano'},
      {io:'mangerò',tu:'mangerai',lui:'mangerà',noi:'mangeremo',voi:'mangerete',loro:'mangeranno'},
      {io:'mangerei',tu:'mangeresti',lui:'mangerebbe',noi:'mangeremmo',voi:'mangereste',loro:'mangerebbero'},
      {io:'mangi',tu:'mangi',lui:'mangi',noi:'mangiamo',voi:'mangiate',loro:'mangino'}
    ),null,['Cosa mangi?'],['a1']),

  makeVerb('it_0264',264,'bere','to drink','ere',true,
    conj(
      {io:'bevo',tu:'bevi',lui:'beve',noi:'beviamo',voi:'bevete',loro:'bevono'},
      'avere','bevuto',{io:'ho bevuto',tu:'hai bevuto',lui:'ha bevuto',noi:'abbiamo bevuto',voi:'avete bevuto',loro:'hanno bevuto'},
      {io:'bevevo',tu:'bevevi',lui:'beveva',noi:'bevevamo',voi:'bevevate',loro:'bevevano'},
      {io:'berrò',tu:'berrai',lui:'berrà',noi:'berremo',voi:'berrete',loro:'berranno'},
      {io:'berrei',tu:'berresti',lui:'berrebbe',noi:'berremmo',voi:'berreste',loro:'berrebbero'},
      {io:'beva',tu:'beva',lui:'beva',noi:'beviamo',voi:'beviate',loro:'bevano'}
    ),{imperfetto:'bevevo',futuro:'berrò'},['Cosa vuoi bere?'],['a1']),

  makeVerb('it_0265',265,'dormire','to sleep','ire',false,
    conj(
      {io:'dormo',tu:'dormi',lui:'dorme',noi:'dormiamo',voi:'dormite',loro:'dormono'},
      'avere','dormito',{io:'ho dormito',tu:'hai dormito',lui:'ha dormito',noi:'abbiamo dormito',voi:'avete dormito',loro:'hanno dormito'},
      {io:'dormivo',tu:'dormivi',lui:'dormiva',noi:'dormivamo',voi:'dormivate',loro:'dormivano'},
      {io:'dormirò',tu:'dormirai',lui:'dormirà',noi:'dormiremo',voi:'dormirete',loro:'dormiranno'},
      {io:'dormirei',tu:'dormiresti',lui:'dormirebbe',noi:'dormiremmo',voi:'dormireste',loro:'dormirebbero'},
      {io:'dorma',tu:'dorma',lui:'dorma',noi:'dormiamo',voi:'dormiate',loro:'dormano'}
    ),null,['Quanto hai dormito?'],['a1']),

  makeVerb('it_0266',266,'leggere','to read','ere',false,
    conj(
      {io:'leggo',tu:'leggi',lui:'legge',noi:'leggiamo',voi:'leggete',loro:'leggono'},
      'avere','letto',{io:'ho letto',tu:'hai letto',lui:'ha letto',noi:'abbiamo letto',voi:'avete letto',loro:'hanno letto'},
      {io:'leggevo',tu:'leggevi',lui:'leggeva',noi:'leggevamo',voi:'leggevate',loro:'leggevano'},
      {io:'leggerò',tu:'leggerai',lui:'leggerà',noi:'leggeremo',voi:'leggerete',loro:'leggeranno'},
      {io:'leggerei',tu:'leggeresti',lui:'leggerebbe',noi:'leggeremmo',voi:'leggereste',loro:'leggerebbero'},
      {io:'legga',tu:'legga',lui:'legga',noi:'leggiamo',voi:'leggiate',loro:'leggano'}
    ),{pastParticiple:'letto'},['Leggo ogni giorno.'],['a1']),

  makeVerb('it_0267',267,'scrivere','to write','ere',false,
    conj(
      {io:'scrivo',tu:'scrivi',lui:'scrive',noi:'scriviamo',voi:'scrivete',loro:'scrivono'},
      'avere','scritto',{io:'ho scritto',tu:'hai scritto',lui:'ha scritto',noi:'abbiamo scritto',voi:'avete scritto',loro:'hanno scritto'},
      {io:'scrivevo',tu:'scrivevi',lui:'scriveva',noi:'scrivevamo',voi:'scrivevate',loro:'scrivevano'},
      {io:'scriverò',tu:'scriverai',lui:'scriverà',noi:'scriveremo',voi:'scriverete',loro:'scriveranno'},
      {io:'scriverei',tu:'scriveresti',lui:'scriverebbe',noi:'scriveremmo',voi:'scrivereste',loro:'scriverebbero'},
      {io:'scriva',tu:'scriva',lui:'scriva',noi:'scriviamo',voi:'scriviate',loro:'scrivano'}
    ),{pastParticiple:'scritto'},['Scrivi spesso?'],['a1']),

  makeVerb('it_0268',268,'aprire','to open','ire',false,
    conj(
      {io:'apro',tu:'apri',lui:'apre',noi:'apriamo',voi:'aprite',loro:'aprono'},
      'avere','aperto',{io:'ho aperto',tu:'hai aperto',lui:'ha aperto',noi:'abbiamo aperto',voi:'avete aperto',loro:'hanno aperto'},
      {io:'aprivo',tu:'aprivi',lui:'apriva',noi:'aprivamo',voi:'aprivate',loro:'aprivano'},
      {io:'aprirò',tu:'aprirai',lui:'aprirà',noi:'apriremo',voi:'aprirete',loro:'apriranno'},
      {io:'aprirei',tu:'apriresti',lui:'aprirebbe',noi:'apriremmo',voi:'aprireste',loro:'aprirebbero'},
      {io:'apra',tu:'apra',lui:'apra',noi:'apriamo',voi:'apriate',loro:'aprano'}
    ),{pastParticiple:'aperto'},['Apri la porta.'],['a1']),

  makeVerb('it_0269',269,'uscire','to go out','ire',true,
    conj(
      {io:'esco',tu:'esci',lui:'esce',noi:'usciamo',voi:'uscite',loro:'escono'},
      'essere','uscito',{io:'sono uscito',tu:'sei uscito',lui:'è uscito',noi:'siamo usciti',voi:'siete usciti',loro:'sono usciti'},
      {io:'uscivo',tu:'uscivi',lui:'usciva',noi:'uscivamo',voi:'uscivate',loro:'uscivano'},
      {io:'uscirò',tu:'uscirai',lui:'uscirà',noi:'usciremo',voi:'uscirete',loro:'usciranno'},
      {io:'uscirei',tu:'usciresti',lui:'uscirebbe',noi:'usciremmo',voi:'uscireste',loro:'uscirebbero'},
      {io:'esca',tu:'esca',lui:'esca',noi:'usciamo',voi:'usciate',loro:'escano'}
    ),{presente:'esco/esci/esce'},['A che ora esci?'],['a1']),

  makeVerb('it_0270',270,'entrare','to enter','are',false,
    conj(
      {io:'entro',tu:'entri',lui:'entra',noi:'entriamo',voi:'entrate',loro:'entrano'},
      'essere','entrato',{io:'sono entrato',tu:'sei entrato',lui:'è entrato',noi:'siamo entrati',voi:'siete entrati',loro:'sono entrati'},
      {io:'entravo',tu:'entravi',lui:'entrava',noi:'entravamo',voi:'entravate',loro:'entravano'},
      {io:'entrerò',tu:'entrerai',lui:'entrerà',noi:'entreremo',voi:'entrerete',loro:'entreranno'},
      {io:'entrerei',tu:'entreresti',lui:'entrerebbe',noi:'entreremmo',voi:'entrereste',loro:'entrerebbero'},
      {io:'entri',tu:'entri',lui:'entri',noi:'entriamo',voi:'entriate',loro:'entrino'}
    ),null,['Entra, prego.'],['a1']),

  // 271-280: More verbs
  makeVerb('it_0271',271,'finire','to finish','ire',false,
    conj(
      {io:'finisco',tu:'finisci',lui:'finisce',noi:'finiamo',voi:'finite',loro:'finiscono'},
      'avere','finito',{io:'ho finito',tu:'hai finito',lui:'ha finito',noi:'abbiamo finito',voi:'avete finito',loro:'hanno finito'},
      {io:'finivo',tu:'finivi',lui:'finiva',noi:'finivamo',voi:'finivate',loro:'finivano'},
      {io:'finirò',tu:'finirai',lui:'finirà',noi:'finiremo',voi:'finirete',loro:'finiranno'},
      {io:'finirei',tu:'finiresti',lui:'finirebbe',noi:'finiremmo',voi:'finireste',loro:'finirebbero'},
      {io:'finisca',tu:'finisca',lui:'finisca',noi:'finiamo',voi:'finiate',loro:'finiscano'}
    ),null,['Ho finito il lavoro.'],['a1']),

  makeVerb('it_0272',272,'cominciare','to begin','are',false,
    conj(
      {io:'comincio',tu:'cominci',lui:'comincia',noi:'cominciamo',voi:'cominciate',loro:'cominciano'},
      'avere','cominciato',{io:'ho cominciato',tu:'hai cominciato',lui:'ha cominciato',noi:'abbiamo cominciato',voi:'avete cominciato',loro:'hanno cominciato'},
      {io:'cominciavo',tu:'cominciavi',lui:'cominciava',noi:'cominciavamo',voi:'cominciavate',loro:'cominciavano'},
      {io:'comincerò',tu:'comincerai',lui:'comincerà',noi:'cominceremo',voi:'comincerete',loro:'cominceranno'},
      {io:'comincerei',tu:'cominceresti',lui:'comincerebbe',noi:'cominceremmo',voi:'comincereste',loro:'comincerebbero'},
      {io:'cominci',tu:'cominci',lui:'cominci',noi:'cominciamo',voi:'cominciate',loro:'comincino'}
    ),null,['Quando comincia il film?'],['a1']),

  makeVerb('it_0273',273,'aspettare','to wait','are',false,
    conj(
      {io:'aspetto',tu:'aspetti',lui:'aspetta',noi:'aspettiamo',voi:'aspettate',loro:'aspettano'},
      'avere','aspettato',{io:'ho aspettato',tu:'hai aspettato',lui:'ha aspettato',noi:'abbiamo aspettato',voi:'avete aspettato',loro:'hanno aspettato'},
      {io:'aspettavo',tu:'aspettavi',lui:'aspettava',noi:'aspettavamo',voi:'aspettavate',loro:'aspettavano'},
      {io:'aspetterò',tu:'aspetterai',lui:'aspetterà',noi:'aspetteremo',voi:'aspetterete',loro:'aspetteranno'},
      {io:'aspetterei',tu:'aspetteresti',lui:'aspetterebbe',noi:'aspetteremmo',voi:'aspettereste',loro:'aspetterebbero'},
      {io:'aspetti',tu:'aspetti',lui:'aspetti',noi:'aspettiamo',voi:'aspettiate',loro:'aspettino'}
    ),null,['Aspetta un momento.'],['a1']),

  makeVerb('it_0274',274,'ricordare','to remember','are',false,
    conj(
      {io:'ricordo',tu:'ricordi',lui:'ricorda',noi:'ricordiamo',voi:'ricordate',loro:'ricordano'},
      'avere','ricordato',{io:'ho ricordato',tu:'hai ricordato',lui:'ha ricordato',noi:'abbiamo ricordato',voi:'avete ricordato',loro:'hanno ricordato'},
      {io:'ricordavo',tu:'ricordavi',lui:'ricordava',noi:'ricordavamo',voi:'ricordavate',loro:'ricordavano'},
      {io:'ricorderò',tu:'ricorderai',lui:'ricorderà',noi:'ricorderemo',voi:'ricorderete',loro:'ricorderanno'},
      {io:'ricorderei',tu:'ricorderesti',lui:'ricorderebbe',noi:'ricorderemmo',voi:'ricordereste',loro:'ricorderebbero'},
      {io:'ricordi',tu:'ricordi',lui:'ricordi',noi:'ricordiamo',voi:'ricordiate',loro:'ricordino'}
    ),null,['Ricordi quella canzone?'],['a1']),

  makeVerb('it_0275',275,'cambiare','to change','are',false,
    conj(
      {io:'cambio',tu:'cambi',lui:'cambia',noi:'cambiamo',voi:'cambiate',loro:'cambiano'},
      'avere','cambiato',{io:'ho cambiato',tu:'hai cambiato',lui:'ha cambiato',noi:'abbiamo cambiato',voi:'avete cambiato',loro:'hanno cambiato'},
      {io:'cambiavo',tu:'cambiavi',lui:'cambiava',noi:'cambiavamo',voi:'cambiavate',loro:'cambiavano'},
      {io:'cambierò',tu:'cambierai',lui:'cambierà',noi:'cambieremo',voi:'cambierete',loro:'cambieranno'},
      {io:'cambierei',tu:'cambieresti',lui:'cambierebbe',noi:'cambieremmo',voi:'cambiereste',loro:'cambierebbero'},
      {io:'cambi',tu:'cambi',lui:'cambi',noi:'cambiamo',voi:'cambiate',loro:'cambino'}
    ),null,['Le cose cambiano.'],['a1']),

  makeVerb('it_0276',276,'usare','to use','are',false,
    conj(
      {io:'uso',tu:'usi',lui:'usa',noi:'usiamo',voi:'usate',loro:'usano'},
      'avere','usato',{io:'ho usato',tu:'hai usato',lui:'ha usato',noi:'abbiamo usato',voi:'avete usato',loro:'hanno usato'},
      {io:'usavo',tu:'usavi',lui:'usava',noi:'usavamo',voi:'usavate',loro:'usavano'},
      {io:'userò',tu:'userai',lui:'userà',noi:'useremo',voi:'userete',loro:'useranno'},
      {io:'userei',tu:'useresti',lui:'userebbe',noi:'useremmo',voi:'usereste',loro:'userebbero'},
      {io:'usi',tu:'usi',lui:'usi',noi:'usiamo',voi:'usiate',loro:'usino'}
    ),null,['Come si usa?'],['a1']),

  makeVerb('it_0277',277,'pagare','to pay','are',false,
    conj(
      {io:'pago',tu:'paghi',lui:'paga',noi:'paghiamo',voi:'pagate',loro:'pagano'},
      'avere','pagato',{io:'ho pagato',tu:'hai pagato',lui:'ha pagato',noi:'abbiamo pagato',voi:'avete pagato',loro:'hanno pagato'},
      {io:'pagavo',tu:'pagavi',lui:'pagava',noi:'pagavamo',voi:'pagavate',loro:'pagavano'},
      {io:'pagherò',tu:'pagherai',lui:'pagherà',noi:'pagheremo',voi:'pagherete',loro:'pagheranno'},
      {io:'pagherei',tu:'pagheresti',lui:'pagherebbe',noi:'pagheremmo',voi:'paghereste',loro:'pagherebbero'},
      {io:'paghi',tu:'paghi',lui:'paghi',noi:'paghiamo',voi:'paghiate',loro:'paghino'}
    ),null,['Quanto hai pagato?'],['a1']),

  makeVerb('it_0278',278,'aiutare','to help','are',false,
    conj(
      {io:'aiuto',tu:'aiuti',lui:'aiuta',noi:'aiutiamo',voi:'aiutate',loro:'aiutano'},
      'avere','aiutato',{io:'ho aiutato',tu:'hai aiutato',lui:'ha aiutato',noi:'abbiamo aiutato',voi:'avete aiutato',loro:'hanno aiutato'},
      {io:'aiutavo',tu:'aiutavi',lui:'aiutava',noi:'aiutavamo',voi:'aiutavate',loro:'aiutavano'},
      {io:'aiuterò',tu:'aiuterai',lui:'aiuterà',noi:'aiuteremo',voi:'aiuterete',loro:'aiuteranno'},
      {io:'aiuterei',tu:'aiuteresti',lui:'aiuterebbe',noi:'aiuteremmo',voi:'aiutereste',loro:'aiuterebbero'},
      {io:'aiuti',tu:'aiuti',lui:'aiuti',noi:'aiutiamo',voi:'aiutiate',loro:'aiutino'}
    ),null,['Puoi aiutarmi?'],['a1']),

  makeVerb('it_0279',279,'giocare','to play (games)','are',false,
    conj(
      {io:'gioco',tu:'giochi',lui:'gioca',noi:'giochiamo',voi:'giocate',loro:'giocano'},
      'avere','giocato',{io:'ho giocato',tu:'hai giocato',lui:'ha giocato',noi:'abbiamo giocato',voi:'avete giocato',loro:'hanno giocato'},
      {io:'giocavo',tu:'giocavi',lui:'giocava',noi:'giocavamo',voi:'giocavate',loro:'giocavano'},
      {io:'giocherò',tu:'giocherai',lui:'giocherà',noi:'giocheremo',voi:'giocherete',loro:'giocheranno'},
      {io:'giocherei',tu:'giocheresti',lui:'giocherebbe',noi:'giocheremmo',voi:'giochereste',loro:'giocherebbero'},
      {io:'giochi',tu:'giochi',lui:'giochi',noi:'giochiamo',voi:'giochiate',loro:'giochino'}
    ),null,['Giochi a calcio?'],['a1']),

  makeVerb('it_0280',280,'studiare','to study','are',false,
    conj(
      {io:'studio',tu:'studi',lui:'studia',noi:'studiamo',voi:'studiate',loro:'studiano'},
      'avere','studiato',{io:'ho studiato',tu:'hai studiato',lui:'ha studiato',noi:'abbiamo studiato',voi:'avete studiato',loro:'hanno studiato'},
      {io:'studiavo',tu:'studiavi',lui:'studiava',noi:'studiavamo',voi:'studiavate',loro:'studiavano'},
      {io:'studierò',tu:'studierai',lui:'studierà',noi:'studieremo',voi:'studierete',loro:'studieranno'},
      {io:'studierei',tu:'studieresti',lui:'studierebbe',noi:'studieremmo',voi:'studiereste',loro:'studierebbero'},
      {io:'studi',tu:'studi',lui:'studi',noi:'studiamo',voi:'studiate',loro:'studino'}
    ),null,['Studi italiano?'],['a1']),

  // 281-310: Common nouns
  makeNoun('it_0281',281,'cibo','food','masculine','cibi',['Mi piace il cibo italiano.'],['a1']),
  makeNoun('it_0282',282,'acqua','water — see rank 118','masculine',null,['—'],['a1']), // skip dup
  makeNoun('it_0283',283,'vino','wine','masculine','vini',['Un bicchiere di vino, grazie.'],['a1']),
  makeNoun('it_0284',284,'caffè','coffee','masculine','caffè',['Un caffè, per favore.'],['a1']),
  makeNoun('it_0285',285,'pane','bread','masculine','pani',['Compro il pane ogni mattina.'],['a1']),
  makeNoun('it_0286',286,'carne','meat','feminine','carni',['Non mangio carne.'],['a1']),
  makeNoun('it_0287',287,'pesce','fish','masculine','pesci',['Mangio il pesce il venerdì.'],['a1']),
  makeNoun('it_0288',288,'frutta','fruit','feminine',null,['Mangio molta frutta.'],['a1']),
  makeNoun('it_0289',289,'verdura','vegetables','feminine',null,['La verdura fa bene.'],['a1']),
  makeNoun('it_0290',290,'formaggio','cheese','masculine','formaggi',['Il parmigiano è un formaggio.'],['a1']),
  makeNoun('it_0291',291,'soldo','money/coin','masculine','soldi',['Non ho soldi.'],['a1']),
  makeNoun('it_0292',292,'prezzo','price','masculine','prezzi',['Qual è il prezzo?'],['a1']),
  makeNoun('it_0293',293,'negozio','shop/store','masculine','negozi',['Il negozio è chiuso.'],['a1']),
  makeNoun('it_0294',294,'mercato','market','masculine','mercati',['Vado al mercato.'],['a1']),
  makeNoun('it_0295',295,'centro','center/downtown','masculine','centri',['Abito in centro.'],['a1']),
  makeNoun('it_0296',296,'ufficio','office','masculine','uffici',['Lavoro in ufficio.'],['a1']),
  makeNoun('it_0297',297,'ospedale','hospital','masculine','ospedali',['È all\'ospedale.'],['a1']),
  makeNoun('it_0298',298,'chiesa','church','feminine','chiese',['La chiesa è bella.'],['a1']),
  makeNoun('it_0299',299,'albergo','hotel','masculine','alberghi',['Cerco un albergo.'],['a1']),
  makeNoun('it_0300',300,'ristorante','restaurant','masculine','ristoranti',['Andiamo al ristorante.'],['a1']),
  makeNoun('it_0301',301,'treno','train','masculine','treni',['Il treno è in ritardo.'],['a1']),
  makeNoun('it_0302',302,'aereo','airplane','masculine','aerei',['Prendo l\'aereo.'],['a1']),
  makeNoun('it_0303',303,'autobus','bus','masculine','autobus',['Prendo l\'autobus.'],['a1']),
  makeNoun('it_0304',304,'barca','boat','feminine','barche',['Andiamo in barca.'],['a1']),
  makeNoun('it_0305',305,'biglietto','ticket','masculine','biglietti',['Compro il biglietto.'],['a1']),
  makeNoun('it_0306',306,'lingua','language/tongue','feminine','lingue',['Parlo tre lingue.'],['a1']),
  makeNoun('it_0307',307,'musica','music','feminine',null,['Mi piace la musica.'],['a1']),
  makeNoun('it_0308',308,'film','film/movie','masculine','film',['Ho visto un bel film.'],['a1']),
  makeNoun('it_0309',309,'sport','sport','masculine','sport',['Faccio sport ogni giorno.'],['a1']),
  makeNoun('it_0310',310,'calcio','soccer/kick','masculine',null,['Il calcio è popolare in Italia.'],['a1']),

  // 311-330: More nouns
  makeNoun('it_0311',311,'telefono','telephone','masculine','telefoni',['Il mio telefono è scarico.'],['a1']),
  makeNoun('it_0312',312,'computer','computer','masculine','computer',['Uso il computer ogni giorno.'],['a1']),
  makeNoun('it_0313',313,'internet','internet','masculine',null,['Cerco su internet.'],['a1']),
  makeNoun('it_0314',314,'foto','photo','feminine','foto',['Faccio una foto.'],['a1']),
  makeNoun('it_0315',315,'lettera','letter','feminine','lettere',['Scrivo una lettera.'],['a1']),
  makeNoun('it_0316',316,'notizia','news','feminine','notizie',['Ho sentito la notizia.'],['a2']),
  makeNoun('it_0317',317,'giornale','newspaper','masculine','giornali',['Leggo il giornale.'],['a1']),
  makeNoun('it_0318',318,'televisione','television','feminine',null,['Guardo la televisione.'],['a1']),
  makeNoun('it_0319',319,'colore','color','masculine','colori',['Qual è il tuo colore preferito?'],['a1']),
  makeNoun('it_0320',320,'numero','number — see 113','masculine','numeri',['—'],['a1']),
  makeNoun('it_0321',321,'ora','hour/now — see 102','feminine','ore',['—'],['a1']),
  makeNoun('it_0322',322,'minuto','minute','masculine','minuti',['Aspetta cinque minuti.'],['a1']),
  makeNoun('it_0323',323,'secondo','second','masculine','secondi',['Aspetta un secondo!'],['a1']),
  makeNoun('it_0324',324,'domenica','Sunday','feminine','domeniche',['Di domenica riposo.'],['a1']),
  makeNoun('it_0325',325,'lunedì','Monday','masculine','lunedì',['Lavoro il lunedì.'],['a1']),
  makeNoun('it_0326',326,'martedì','Tuesday','masculine','martedì',['Il martedì ho lezione.'],['a1']),
  makeNoun('it_0327',327,'mercoledì','Wednesday','masculine','mercoledì',['Ci vediamo mercoledì.'],['a1']),
  makeNoun('it_0328',328,'giovedì','Thursday','masculine','giovedì',['Giovedì sera esco.'],['a1']),
  makeNoun('it_0329',329,'venerdì','Friday','masculine','venerdì',['Il venerdì sono stanco.'],['a1']),
  makeNoun('it_0330',330,'sabato','Saturday','masculine','sabati',['Il sabato mi riposo.'],['a1']),

  // 331-350: More nouns - months and seasons
  makeNoun('it_0331',331,'gennaio','January','masculine',null,['Sono nato a gennaio.'],['a1']),
  makeNoun('it_0332',332,'febbraio','February','masculine',null,['A febbraio fa freddo.'],['a1']),
  makeNoun('it_0333',333,'marzo','March','masculine',null,['In marzo comincia la primavera.'],['a1']),
  makeNoun('it_0334',334,'aprile','April','masculine',null,['Ad aprile piove spesso.'],['a1']),
  makeNoun('it_0335',335,'maggio','May','masculine',null,['A maggio fa bello.'],['a1']),
  makeNoun('it_0336',336,'giugno','June','masculine',null,['In giugno inizia l\'estate.'],['a1']),
  makeNoun('it_0337',337,'luglio','July','masculine',null,['A luglio vado in vacanza.'],['a1']),
  makeNoun('it_0338',338,'agosto','August','masculine',null,['In agosto c\'è molto caldo.'],['a1']),
  makeNoun('it_0339',339,'settembre','September','masculine',null,['A settembre torno a scuola.'],['a1']),
  makeNoun('it_0340',340,'ottobre','October','masculine',null,['In ottobre le foglie cadono.'],['a1']),
  makeNoun('it_0341',341,'novembre','November','masculine',null,['A novembre fa già freddo.'],['a1']),
  makeNoun('it_0342',342,'dicembre','December','masculine',null,['In dicembre c\'è il Natale.'],['a1']),
  makeNoun('it_0343',343,'primavera','spring','feminine','primavere',['La primavera è bella.'],['a1']),
  makeNoun('it_0344',344,'estate','summer','feminine','estati',['D\'estate vado al mare.'],['a1']),
  makeNoun('it_0345',345,'autunno','autumn','masculine','autunni',['L\'autunno è la mia stagione preferita.'],['a1']),
  makeNoun('it_0346',346,'inverno','winter','masculine','inverni',['D\'inverno nevica.'],['a1']),
  makeNoun('it_0347',347,'vacanza','vacation/holiday','feminine','vacanze',['Quando vai in vacanza?'],['a1']),
  makeNoun('it_0348',348,'viaggio','trip/journey','masculine','viaggi',['Buon viaggio!'],['a1']),
  makeNoun('it_0349',349,'passaporto','passport','masculine','passaporti',['Ho il passaporto.'],['a1']),
  makeNoun('it_0350',350,'valigia','suitcase','feminine','valigie',['Ho fatto la valigia.'],['a1']),

  // 351-380: Adjectives
  makeAdj('it_0351',351,'stanco','tired','stanchi',['Sono molto stanco.'],['a1']),
  makeAdj('it_0352',352,'malato','sick/ill','malati',['Sono malato oggi.'],['a1']),
  makeAdj('it_0353',353,'pronto','ready','pronti',['Sei pronto?'],['a1']),
  makeAdj('it_0354',354,'occupato','busy/occupied','occupati',['Sono occupato adesso.'],['a1']),
  makeAdj('it_0355',355,'simpatico','nice/likeable','simpatici',['È un tipo simpatico.'],['a1']),
  makeAdj('it_0356',356,'antipatico','unpleasant','antipatici',['È un tipo antipatico.'],['a1']),
  makeAdj('it_0357',357,'intelligente','intelligent','intelligenti',['È molto intelligente.'],['a1']),
  makeAdj('it_0358',358,'stupido','stupid','stupidi',['Non fare lo stupido.'],['a1']),
  makeAdj('it_0359',359,'gentile','kind/gentle','gentili',['Sei molto gentile.'],['a1']),
  makeAdj('it_0360',360,'educato','polite/educated','educati',['È molto educato.'],['a1']),
  makeAdj('it_0361',361,'veloce','fast/quick','veloci',['Sei veloce!'],['a1']),
  makeAdj('it_0362',362,'lento','slow','lenti',['Vai troppo lento.'],['a1']),
  makeAdj('it_0363',363,'pesante','heavy','pesanti',['La valigia è pesante.'],['a2']),
  makeAdj('it_0364',364,'leggero','light/mild','leggeri',['Il pasto è leggero.'],['a2']),
  makeAdj('it_0365',365,'pulito','clean','puliti',['La casa è pulita.'],['a1']),
  makeAdj('it_0366',366,'sporco','dirty','sporchi',['Hai le mani sporche.'],['a1']),
  makeAdj('it_0367',367,'pieno','full','pieni',['Il bicchiere è pieno.'],['a1']),
  makeAdj('it_0368',368,'vuoto','empty','vuoti',['Il frigorifero è vuoto.'],['a1']),
  makeAdj('it_0369',369,'giusto','right/correct/fair','giusti',['Hai ragione, è giusto.'],['a1']),
  makeAdj('it_0370',370,'sbagliato','wrong/mistaken','sbagliati',['Questa risposta è sbagliata.'],['a1']),
  makeAdj('it_0371',371,'uguale','equal/same','uguali',['Sono uguali.'],['a2']),
  makeAdj('it_0372',372,'diverso','different','diversi',['Siamo molto diversi.'],['a1']),
  makeAdj('it_0373',373,'simile','similar','simili',['Sono simili.'],['a2']),
  makeAdj('it_0374',374,'strano','strange/odd','strani',['Che cosa strana!'],['a1']),
  makeAdj('it_0375',375,'normale','normal','normali',['È normale.'],['a1']),
  makeAdj('it_0376',376,'speciale','special','speciali',['Oggi è un giorno speciale.'],['a1']),
  makeAdj('it_0377',377,'necessario','necessary','necessari',['È necessario studiare.'],['a2']),
  makeAdj('it_0378',378,'possibile','possible','possibili',['È possibile?'],['a1']),
  makeAdj('it_0379',379,'impossibile','impossible','impossibili',['È impossibile!'],['a1']),
  makeAdj('it_0380',380,'sicuro','sure/safe','sicuri',['Sei sicuro?'],['a1']),

  // 381-410: More adjectives and adverbs
  makeAdj('it_0381',381,'pericoloso','dangerous','pericolosi',['È pericoloso.'],['a2']),
  makeAdj('it_0382',382,'interessante','interesting','interessanti',['È un libro interessante.'],['a1']),
  makeAdj('it_0383',383,'noioso','boring','noiosi',['Il film è noioso.'],['a1']),
  makeAdj('it_0384',384,'divertente','fun/amusing','divertenti',['È molto divertente!'],['a1']),
  makeAdj('it_0385',385,'stupendo','wonderful','stupendi',['È stupendo!'],['a1']),
  makeAdj('it_0386',386,'terribile','terrible','terribili',['È una situazione terribile.'],['a2']),
  makeAdj('it_0387',387,'meraviglioso','wonderful/marvelous','meravigliosi',['Che vista meravigliosa!'],['a2']),
  makeAdj('it_0388',388,'famoso','famous','famosi',['È un attore famoso.'],['a1']),
  makeAdj('it_0389',389,'straniero','foreign/foreigner','stranieri',['Parla come uno straniero.'],['a2']),
  makeAdj('it_0390',390,'italiano','Italian','italiani',['Parlo italiano.'],['a1']),
  makeAdv('it_0391',391,'subito','immediately','Vengo subito.',['a1']),
  makeAdv('it_0392',392,'improvvisamente','suddenly',['È arrivato improvvisamente.'],['a2']),
  makeAdv('it_0393',393,'lentamente','slowly',['Parla lentamente, per favore.'],['a1']),
  makeAdv('it_0394',394,'velocemente','quickly',['Va velocemente.'],['a1']),
  makeAdv('it_0395',395,'facilmente','easily',['Si impara facilmente.'],['a2']),
  makeAdv('it_0396',396,'raramente','rarely',['Vado raramente al cinema.'],['a2']),
  makeAdv('it_0397',397,'recentemente','recently',['L\'ho visto recentemente.'],['a2']),
  makeAdv('it_0398',398,'esattamente','exactly',['Esattamente così!'],['a2']),
  makeAdv('it_0399',399,'assolutamente','absolutely',['Assolutamente sì!'],['a2']),
  makeAdv('it_0400',400,'solamente','only/just',['Solamente un momento.'],['a1']),

  // 401-430: More nouns
  makeNoun('it_0401',401,'fratello','brother','masculine','fratelli',['Ho un fratello.'],['a1']),
  makeNoun('it_0402',402,'sorella','sister','feminine','sorelle',['Mia sorella abita a Roma.'],['a1']),
  makeNoun('it_0403',403,'marito','husband','masculine','mariti',['Mio marito lavora molto.'],['a1']),
  makeNoun('it_0404',404,'moglie','wife','feminine','mogli',['Mia moglie cucina bene.'],['a1'],true),
  makeNoun('it_0405',405,'nonno','grandfather','masculine','nonni',['Mio nonno ha ottant\'anni.'],['a1']),
  makeNoun('it_0406',406,'nonna','grandmother','feminine','nonne',['La nonna cucina la pasta.'],['a1']),
  makeNoun('it_0407',407,'zio','uncle','masculine','zii',['Mio zio vive in America.'],['a1']),
  makeNoun('it_0408',408,'zia','aunt','feminine','zie',['Mia zia è gentile.'],['a1']),
  makeNoun('it_0409',409,'cugino','cousin (m)','masculine','cugini',['Mio cugino ha vent\'anni.'],['a1']),
  makeNoun('it_0410',410,'nipote','nephew/niece/grandchild','masculine','nipoti',['Mio nipote studia all\'università.'],['a1']),
  makeNoun('it_0411',411,'maestra','teacher (f)','feminine','maestre',['La maestra è brava.'],['a1']),
  makeNoun('it_0412',412,'professore','professor/teacher (m)','masculine','professori',['Il professore spiega bene.'],['a1']),
  makeNoun('it_0413',413,'studente','student','masculine','studenti',['Sono uno studente.'],['a1']),
  makeNoun('it_0414',414,'medico','doctor','masculine','medici',['Vado dal medico.'],['a1']),
  makeNoun('it_0415',415,'avvocato','lawyer','masculine','avvocati',['Ho bisogno di un avvocato.'],['a2']),
  makeNoun('it_0416',416,'poliziotto','police officer','masculine','poliziotti',['Il poliziotto aiuta.'],['a1']),
  makeNoun('it_0417',417,'cuoco','cook/chef','masculine','cuochi',['Il cuoco è bravo.'],['a1']),
  makeNoun('it_0418',418,'operaio','worker','masculine','operai',['L\'operaio lavora in fabbrica.'],['a2']),
  makeNoun('it_0419',419,'contadino','farmer/peasant','masculine','contadini',['Il contadino coltiva la terra.'],['a2']),
  makeNoun('it_0420',420,'commerciante','merchant','masculine','commercianti',['È un commerciante.'],['a2']),

  // 421-450: More vocabulary
  makeNoun('it_0421',421,'appartamento','apartment','masculine','appartamenti',['Ho un appartamento in affitto.'],['a1']),
  makeNoun('it_0422',422,'cucina','kitchen/cuisine','feminine','cucine',['Mi piace la cucina italiana.'],['a1']),
  makeNoun('it_0423',423,'bagno','bathroom','masculine','bagni',['Dov\'è il bagno?'],['a1']),
  makeNoun('it_0424',424,'salotto','living room','masculine','salotti',['Siamo in salotto.'],['a1']),
  makeNoun('it_0425',425,'camera','room/bedroom','feminine','camere',['Ho prenotato una camera.'],['a1']),
  makeNoun('it_0426',426,'giardino','garden','masculine','giardini',['Ho un giardino bello.'],['a1']),
  makeNoun('it_0427',427,'chiave','key','feminine','chiavi',['Ho perso le chiavi.'],['a1']),
  makeNoun('it_0428',428,'indirizzo','address','masculine','indirizzi',['Qual è il tuo indirizzo?'],['a1']),
  makeNoun('it_0429',429,'piano','floor/plan','masculine','piani',['Abito al terzo piano.'],['a1']),
  makeNoun('it_0430',430,'ascensore','elevator','masculine','ascensori',['Prendo l\'ascensore.'],['a1']),

  // 431-460: Verbs
  makeVerb('it_0431',431,'smettere','to stop (doing)','ere',false,
    conj(
      {io:'smetto',tu:'smetti',lui:'smette',noi:'smettiamo',voi:'smettete',loro:'smettono'},
      'avere','smesso',{io:'ho smesso',tu:'hai smesso',lui:'ha smesso',noi:'abbiamo smesso',voi:'avete smesso',loro:'hanno smesso'},
      {io:'smettevo',tu:'smettevi',lui:'smetteva',noi:'smettevamo',voi:'smettevate',loro:'smettevano'},
      {io:'smetterò',tu:'smetterai',lui:'smetterà',noi:'smetteremo',voi:'smetterete',loro:'smetteranno'},
      {io:'smetterei',tu:'smetteresti',lui:'smetterebbe',noi:'smetteremmo',voi:'smettereste',loro:'smetterebbero'},
      {io:'smetta',tu:'smetta',lui:'smetta',noi:'smettiamo',voi:'smettiate',loro:'smettano'}
    ),{pastParticiple:'smesso'},['Smettila!'],['a2']),

  makeVerb('it_0432',432,'perdere','to lose','ere',false,
    conj(
      {io:'perdo',tu:'perdi',lui:'perde',noi:'perdiamo',voi:'perdete',loro:'perdono'},
      'avere','perso',{io:'ho perso',tu:'hai perso',lui:'ha perso',noi:'abbiamo perso',voi:'avete perso',loro:'hanno perso'},
      {io:'perdevo',tu:'perdevi',lui:'perdeva',noi:'perdevamo',voi:'perdevate',loro:'perdevano'},
      {io:'perderò',tu:'perderai',lui:'perderà',noi:'perderemo',voi:'perderete',loro:'perderanno'},
      {io:'perderei',tu:'perderesti',lui:'perderebbe',noi:'perderemmo',voi:'perdereste',loro:'perderebbero'},
      {io:'perda',tu:'perda',lui:'perda',noi:'perdiamo',voi:'perdiate',loro:'perdano'}
    ),{pastParticiple:'perso/perduto'},['Ho perso le chiavi.'],['a1']),

  makeVerb('it_0433',433,'vincere','to win','ere',false,
    conj(
      {io:'vinco',tu:'vinci',lui:'vince',noi:'vinciamo',voi:'vincete',loro:'vincono'},
      'avere','vinto',{io:'ho vinto',tu:'hai vinto',lui:'ha vinto',noi:'abbiamo vinto',voi:'avete vinto',loro:'hanno vinto'},
      {io:'vincevo',tu:'vincevi',lui:'vinceva',noi:'vincevamo',voi:'vincevate',loro:'vincevano'},
      {io:'vincerò',tu:'vincerai',lui:'vincerà',noi:'vinceremo',voi:'vincerete',loro:'vinceranno'},
      {io:'vincerei',tu:'vinceresti',lui:'vincerebbe',noi:'vinceremmo',voi:'vincereste',loro:'vincerebbero'},
      {io:'vinca',tu:'vinca',lui:'vinca',noi:'vinciamo',voi:'vinciate',loro:'vincano'}
    ),{pastParticiple:'vinto'},['Abbiamo vinto!'],['a2']),

  makeVerb('it_0434',434,'conoscere','to know (a person)','ere',false,
    conj(
      {io:'conosco',tu:'conosci',lui:'conosce',noi:'conosciamo',voi:'conoscete',loro:'conoscono'},
      'avere','conosciuto',{io:'ho conosciuto',tu:'hai conosciuto',lui:'ha conosciuto',noi:'abbiamo conosciuto',voi:'avete conosciuto',loro:'hanno conosciuto'},
      {io:'conoscevo',tu:'conoscevi',lui:'conosceva',noi:'conoscevamo',voi:'conoscevate',loro:'conoscevano'},
      {io:'conoscerò',tu:'conoscerai',lui:'conoscerà',noi:'conosceremo',voi:'conoscerete',loro:'conosceranno'},
      {io:'conoscerei',tu:'conosceresti',lui:'conoscerebbe',noi:'conosceremmo',voi:'conoscereste',loro:'conoscerebbero'},
      {io:'conosca',tu:'conosca',lui:'conosca',noi:'conosciamo',voi:'conosciate',loro:'conoscano'}
    ),null,['Conosci Roma?'],['a1']),

  makeVerb('it_0435',435,'scegliere','to choose','ere',true,
    conj(
      {io:'scelgo',tu:'scegli',lui:'sceglie',noi:'scegliamo',voi:'scegliete',loro:'scelgono'},
      'avere','scelto',{io:'ho scelto',tu:'hai scelto',lui:'ha scelto',noi:'abbiamo scelto',voi:'avete scelto',loro:'hanno scelto'},
      {io:'sceglievo',tu:'sceglievi',lui:'sceglieva',noi:'sceglievamo',voi:'sceglievate',loro:'sceglievano'},
      {io:'sceglierò',tu:'sceglierai',lui:'sceglierà',noi:'sceglieremo',voi:'sceglierete',loro:'sceglieranno'},
      {io:'sceglierei',tu:'sceglieresti',lui:'sceglierebbe',noi:'sceglieremmo',voi:'scegliereste',loro:'sceglierebbero'},
      {io:'scelga',tu:'scelga',lui:'scelga',noi:'scegliamo',voi:'scegliate',loro:'scelgano'}
    ),{presente:'scelgo',pastParticiple:'scelto'},['Scegli tu!'],['a2']),

  makeVerb('it_0436',436,'chiedere','to ask','ere',false,
    conj(
      {io:'chiedo',tu:'chiedi',lui:'chiede',noi:'chiediamo',voi:'chiedete',loro:'chiedono'},
      'avere','chiesto',{io:'ho chiesto',tu:'hai chiesto',lui:'ha chiesto',noi:'abbiamo chiesto',voi:'avete chiesto',loro:'hanno chiesto'},
      {io:'chiedevo',tu:'chiedevi',lui:'chiedeva',noi:'chiedevamo',voi:'chiedevate',loro:'chiedevano'},
      {io:'chiederò',tu:'chiederai',lui:'chiederà',noi:'chiederemo',voi:'chiederete',loro:'chiederanno'},
      {io:'chiederei',tu:'chiederesti',lui:'chiederebbe',noi:'chiederemmo',voi:'chiedereste',loro:'chiederebbero'},
      {io:'chieda',tu:'chieda',lui:'chieda',noi:'chiediamo',voi:'chiediate',loro:'chiedano'}
    ),{pastParticiple:'chiesto'},['Posso chiederti una cosa?'],['a1']),

  makeVerb('it_0437',437,'rispondere','to answer','ere',false,
    conj(
      {io:'rispondo',tu:'rispondi',lui:'risponde',noi:'rispondiamo',voi:'rispondete',loro:'rispondono'},
      'avere','risposto',{io:'ho risposto',tu:'hai risposto',lui:'ha risposto',noi:'abbiamo risposto',voi:'avete risposto',loro:'hanno risposto'},
      {io:'rispondevo',tu:'rispondevi',lui:'rispondeva',noi:'rispondevamo',voi:'rispondevate',loro:'rispondevano'},
      {io:'risponderò',tu:'risponderai',lui:'risponderà',noi:'risponderemo',voi:'risponderete',loro:'risponderanno'},
      {io:'risponderei',tu:'risponderesti',lui:'risponderebbe',noi:'risponderemmo',voi:'rispondereste',loro:'risponderebbero'},
      {io:'risponda',tu:'risponda',lui:'risponda',noi:'rispondiamo',voi:'rispondiate',loro:'rispondano'}
    ),{pastParticiple:'risposto'},['Rispondi al telefono.'],['a1']),

  makeVerb('it_0438',438,'cadere','to fall','ere',false,
    conj(
      {io:'cado',tu:'cadi',lui:'cade',noi:'cadiamo',voi:'cadete',loro:'cadono'},
      'essere','caduto',{io:'sono caduto',tu:'sei caduto',lui:'è caduto',noi:'siamo caduti',voi:'siete caduti',loro:'sono caduti'},
      {io:'cadevo',tu:'cadevi',lui:'cadeva',noi:'cadevamo',voi:'cadevate',loro:'cadevano'},
      {io:'cadrò',tu:'cadrai',lui:'cadrà',noi:'cadremo',voi:'cadrete',loro:'cadranno'},
      {io:'cadrei',tu:'cadresti',lui:'cadrebbe',noi:'cadremmo',voi:'cadreste',loro:'cadrebbero'},
      {io:'cada',tu:'cada',lui:'cada',noi:'cadiamo',voi:'cadiate',loro:'cadano'}
    ),{futuro:'cadrò'},['È caduto per terra.'],['a2']),

  makeVerb('it_0439',439,'spiegare','to explain','are',false,
    conj(
      {io:'spiego',tu:'spieghi',lui:'spiega',noi:'spieghiamo',voi:'spiegate',loro:'spiegano'},
      'avere','spiegato',{io:'ho spiegato',tu:'hai spiegato',lui:'ha spiegato',noi:'abbiamo spiegato',voi:'avete spiegato',loro:'hanno spiegato'},
      {io:'spiegavo',tu:'spiegavi',lui:'spiegava',noi:'spiegavamo',voi:'spiegavate',loro:'spiegavano'},
      {io:'spiegherò',tu:'spiegherai',lui:'spiegherà',noi:'spiegheremo',voi:'spiegherete',loro:'spiegheranno'},
      {io:'spiegherei',tu:'spiegheresti',lui:'spiegherebbe',noi:'spiegheremmo',voi:'spieghereste',loro:'spiegherebbero'},
      {io:'spieghi',tu:'spieghi',lui:'spieghi',noi:'spieghiamo',voi:'spieghiate',loro:'spieghino'}
    ),null,['Spiegami come funziona.'],['a1']),

  makeVerb('it_0440',440,'comprare','to buy','are',false,
    conj(
      {io:'compro',tu:'compri',lui:'compra',noi:'compriamo',voi:'comprate',loro:'comprano'},
      'avere','comprato',{io:'ho comprato',tu:'hai comprato',lui:'ha comprato',noi:'abbiamo comprato',voi:'avete comprato',loro:'hanno comprato'},
      {io:'compravo',tu:'compravi',lui:'comprava',noi:'compravamo',voi:'compravate',loro:'compravano'},
      {io:'comprerò',tu:'comprerai',lui:'comprerà',noi:'compreremo',voi:'comprerete',loro:'compreranno'},
      {io:'comprerei',tu:'compreresti',lui:'comprerebbe',noi:'compreriemmo',voi:'comprereste',loro:'comprerebbero'},
      {io:'compri',tu:'compri',lui:'compri',noi:'compriamo',voi:'compriate',loro:'comprino'}
    ),null,['Ho comprato del pane.'],['a1']),

  // 441-470: Mixed nouns and adverbs
  makeNoun('it_0441',441,'errore','error/mistake','masculine','errori',['Ho fatto un errore.'],['a1']),
  makeNoun('it_0442',442,'risultato','result','masculine','risultati',['Qual è il risultato?'],['a2']),
  makeNoun('it_0443',443,'domanda','question','feminine','domande',['Ho una domanda.'],['a1']),
  makeNoun('it_0444',444,'risposta','answer/response','feminine','risposte',['Qual è la risposta?'],['a1']),
  makeNoun('it_0445',445,'inizio','beginning/start','masculine','inizi',['All\'inizio era difficile.'],['a1']),
  makeNoun('it_0446',446,'origine','origin','feminine','origini',['Qual è la sua origine?'],['a2']),
  makeNoun('it_0447',447,'causa','cause','feminine','cause',['Qual è la causa?'],['a2']),
  makeNoun('it_0448',448,'effetto','effect','masculine','effetti',['Ha avuto un buon effetto.'],['a2']),
  makeNoun('it_0449',449,'mezzo','means/half','masculine','mezzi',['Qual è il mezzo di trasporto?'],['a2']),
  makeNoun('it_0450',450,'sistema','system','masculine','sistemi',['Il sistema funziona.'],['a2']),
  makeNoun('it_0451',451,'società','society/company','feminine','società',['Vivo in questa società.'],['a2']),
  makeNoun('it_0452',452,'economia','economy','feminine','economie',['L\'economia cresce.'],['a2']),
  makeNoun('it_0453',453,'politica','politics','feminine','politiche',['Non parlo di politica.'],['a2']),
  makeNoun('it_0454',454,'cultura','culture','feminine','culture',['La cultura italiana è ricca.'],['a2']),
  makeNoun('it_0455',455,'arte','art','feminine','arti',['Mi piace l\'arte.'],['a1']),
  makeNoun('it_0456',456,'musica','music — see 307','feminine',null,['—'],['a1']),
  makeNoun('it_0457',457,'natura','nature','feminine',null,['Amo la natura.'],['a1']),
  makeNoun('it_0458',458,'ambiente','environment','masculine','ambienti',['Rispetta l\'ambiente.'],['a2']),
  makeNoun('it_0459',459,'clima','climate','masculine','climi',['Il clima è cambiato.'],['a2']),
  makeNoun('it_0460',460,'tempo','weather/time — see 68','masculine','tempi',['Che tempo fa?'],['a1']),
  makeNoun('it_0461',461,'pioggia','rain','feminine','piogge',['Arriva la pioggia.'],['a1']),
  makeNoun('it_0462',462,'neve','snow','feminine',null,['La neve è bianca.'],['a1']),
  makeNoun('it_0463',463,'vento','wind','masculine','venti',['C\'è molto vento.'],['a1']),
  makeNoun('it_0464',464,'nuvola','cloud','feminine','nuvole',['Le nuvole sono grigie.'],['a1']),
  makeNoun('it_0465',465,'fiore','flower','masculine','fiori',['Ho comprato dei fiori.'],['a1']),
  makeNoun('it_0466',466,'albero','tree','masculine','alberi',['C\'è un albero nel giardino.'],['a1']),
  makeNoun('it_0467',467,'animale','animal','masculine','animali',['Gli animali sono liberi.'],['a1']),
  makeNoun('it_0468',468,'cane','dog','masculine','cani',['Ho un cane.'],['a1']),
  makeNoun('it_0469',469,'gatto','cat','masculine','gatti',['Il mio gatto si chiama Leo.'],['a1']),
  makeNoun('it_0470',470,'uccello','bird','masculine','uccelli',['L\'uccello canta.'],['a1']),

  // 471-500: Verbs and final words
  makeVerb('it_0471',471,'volare','to fly','are',false,
    conj(
      {io:'volo',tu:'voli',lui:'vola',noi:'voliamo',voi:'volate',loro:'volano'},
      'avere','volato',{io:'ho volato',tu:'hai volato',lui:'ha volato',noi:'abbiamo volato',voi:'avete volato',loro:'hanno volato'},
      {io:'volavo',tu:'volavi',lui:'volava',noi:'volavamo',voi:'volavate',loro:'volavano'},
      {io:'volerò',tu:'volerai',lui:'volerà',noi:'voleremo',voi:'volerete',loro:'voleranno'},
      {io:'volerei',tu:'voleresti',lui:'volerebbe',noi:'voleremmo',voi:'volereste',loro:'volerebbero'},
      {io:'voli',tu:'voli',lui:'voli',noi:'voliamo',voi:'voliate',loro:'volino'}
    ),null,['L\'uccello vola.'],['a1']),

  makeVerb('it_0472',472,'nuotare','to swim','are',false,
    conj(
      {io:'nuoto',tu:'nuoti',lui:'nuota',noi:'nuotiamo',voi:'nuotate',loro:'nuotano'},
      'avere','nuotato',{io:'ho nuotato',tu:'hai nuotato',lui:'ha nuotato',noi:'abbiamo nuotato',voi:'avete nuotato',loro:'hanno nuotato'},
      {io:'nuotavo',tu:'nuotavi',lui:'nuotava',noi:'nuotavamo',voi:'nuotavate',loro:'nuotavano'},
      {io:'nuoterò',tu:'nuoterai',lui:'nuoterà',noi:'nuoteremo',voi:'nuoterete',loro:'nuoteranno'},
      {io:'nuoterei',tu:'nuoteresti',lui:'nuoterebbe',noi:'nuoteremmo',voi:'nuotereste',loro:'nuoterebbero'},
      {io:'nuoti',tu:'nuoti',lui:'nuoti',noi:'nuotiamo',voi:'nuotiate',loro:'nuotino'}
    ),null,['Sa nuotare?'],['a1']),

  makeVerb('it_0473',473,'correre','to run','ere',false,
    conj(
      {io:'corro',tu:'corri',lui:'corre',noi:'corriamo',voi:'correte',loro:'corrono'},
      'avere','corso',{io:'ho corso',tu:'hai corso',lui:'ha corso',noi:'abbiamo corso',voi:'avete corso',loro:'hanno corso'},
      {io:'correvo',tu:'correvi',lui:'correva',noi:'correvamo',voi:'correvate',loro:'correvano'},
      {io:'correrò',tu:'correrai',lui:'correrà',noi:'correremo',voi:'correrete',loro:'correranno'},
      {io:'correrei',tu:'correresti',lui:'correrebbe',noi:'correremmo',voi:'correreste',loro:'correrebbero'},
      {io:'corra',tu:'corra',lui:'corra',noi:'corriamo',voi:'corriate',loro:'corrano'}
    ),{pastParticiple:'corso'},['Corro ogni mattina.'],['a1']),

  makeVerb('it_0474',474,'cucinare','to cook','are',false,
    conj(
      {io:'cucino',tu:'cucini',lui:'cucina',noi:'cuciniamo',voi:'cucinate',loro:'cucinano'},
      'avere','cucinato',{io:'ho cucinato',tu:'hai cucinato',lui:'ha cucinato',noi:'abbiamo cucinato',voi:'avete cucinato',loro:'hanno cucinato'},
      {io:'cucinavo',tu:'cucinavi',lui:'cucinava',noi:'cucinavamo',voi:'cucinavate',loro:'cucinavano'},
      {io:'cucinerò',tu:'cucinerai',lui:'cucinerà',noi:'cucineremo',voi:'cucinerete',loro:'cucineranno'},
      {io:'cucinerei',tu:'cucineresti',lui:'cucinerebbe',noi:'cucineremmo',voi:'cucinereste',loro:'cucinerebbero'},
      {io:'cucini',tu:'cucini',lui:'cucini',noi:'cuciniamo',voi:'cucinate',loro:'cucinino'}
    ),null,['Cucina bene.'],['a1']),

  makeVerb('it_0475',475,'guidare','to drive','are',false,
    conj(
      {io:'guido',tu:'guidi',lui:'guida',noi:'guidiamo',voi:'guidate',loro:'guidano'},
      'avere','guidato',{io:'ho guidato',tu:'hai guidato',lui:'ha guidato',noi:'abbiamo guidato',voi:'avete guidato',loro:'hanno guidato'},
      {io:'guidavo',tu:'guidavi',lui:'guidava',noi:'guidavamo',voi:'guidavate',loro:'guidavano'},
      {io:'guiderò',tu:'guiderai',lui:'guiderà',noi:'guideremo',voi:'guiderete',loro:'guideranno'},
      {io:'guiderei',tu:'guideresti',lui:'guiderebbe',noi:'guideremmo',voi:'guidereste',loro:'guiderebbero'},
      {io:'guidi',tu:'guidi',lui:'guidi',noi:'guidiamo',voi:'guidiate',loro:'guidino'}
    ),null,['Sa guidare?'],['a1']),

  makeVerb('it_0476',476,'viaggiare','to travel','are',false,
    conj(
      {io:'viaggio',tu:'viaggi',lui:'viaggia',noi:'viaggiamo',voi:'viaggiate',loro:'viaggiano'},
      'avere','viaggiato',{io:'ho viaggiato',tu:'hai viaggiato',lui:'ha viaggiato',noi:'abbiamo viaggiato',voi:'avete viaggiato',loro:'hanno viaggiato'},
      {io:'viaggiavo',tu:'viaggiavi',lui:'viaggiava',noi:'viaggiavamo',voi:'viaggiavate',loro:'viaggiavano'},
      {io:'viaggerò',tu:'viaggerai',lui:'viaggerà',noi:'viaggeremo',voi:'viaggerete',loro:'viaggeranno'},
      {io:'viaggerei',tu:'viaggeresti',lui:'viaggerebbe',noi:'viaggeremmo',voi:'viaggereste',loro:'viaggerebbero'},
      {io:'viaggi',tu:'viaggi',lui:'viaggi',noi:'viaggiamo',voi:'viaggiate',loro:'viaggino'}
    ),null,['Mi piace viaggiare.'],['a1']),

  makeVerb('it_0477',477,'lavorare','to work','are',false,
    conj(
      {io:'lavoro',tu:'lavori',lui:'lavora',noi:'lavoriamo',voi:'lavorate',loro:'lavorano'},
      'avere','lavorato',{io:'ho lavorato',tu:'hai lavorato',lui:'ha lavorato',noi:'abbiamo lavorato',voi:'avete lavorato',loro:'hanno lavorato'},
      {io:'lavoravo',tu:'lavoravi',lui:'lavorava',noi:'lavoravamo',voi:'lavoravate',loro:'lavoravano'},
      {io:'lavorerò',tu:'lavorerai',lui:'lavorerà',noi:'lavoreremo',voi:'lavorerete',loro:'lavoreranno'},
      {io:'lavorerei',tu:'lavoreresti',lui:'lavorerebbe',noi:'lavoreremmo',voi:'lavorereste',loro:'lavorerebbero'},
      {io:'lavori',tu:'lavori',lui:'lavori',noi:'lavoriamo',voi:'lavoriate',loro:'lavorino'}
    ),null,['Dove lavori?'],['a1']),

  makeVerb('it_0478',478,'incontrare','to meet','are',false,
    conj(
      {io:'incontro',tu:'incontri',lui:'incontra',noi:'incontriamo',voi:'incontrate',loro:'incontrano'},
      'avere','incontrato',{io:'ho incontrato',tu:'hai incontrato',lui:'ha incontrato',noi:'abbiamo incontrato',voi:'avete incontrato',loro:'hanno incontrato'},
      {io:'incontravo',tu:'incontravi',lui:'incontrava',noi:'incontravamo',voi:'incontravate',loro:'incontravano'},
      {io:'incontrerò',tu:'incontrerai',lui:'incontrerà',noi:'incontreremo',voi:'incontrerete',loro:'incontreranno'},
      {io:'incontrerei',tu:'incontreresti',lui:'incontrerebbe',noi:'incontreremmo',voi:'incontrereste',loro:'incontrerebbero'},
      {io:'incontri',tu:'incontri',lui:'incontri',noi:'incontriamo',voi:'incontriate',loro:'incontrino'}
    ),null,['Ci incontriamo alle tre.'],['a1']),

  makeVerb('it_0479',479,'imparare','to learn','are',false,
    conj(
      {io:'imparo',tu:'impari',lui:'impara',noi:'impariamo',voi:'imparate',loro:'imparano'},
      'avere','imparato',{io:'ho imparato',tu:'hai imparato',lui:'ha imparato',noi:'abbiamo imparato',voi:'avete imparato',loro:'hanno imparato'},
      {io:'imparavo',tu:'imparavi',lui:'imparava',noi:'imparavamo',voi:'imparavate',loro:'imparavano'},
      {io:'imparerò',tu:'imparerai',lui:'imparerà',noi:'impareremo',voi:'imparerete',loro:'impareranno'},
      {io:'imparerei',tu:'impareresti',lui:'imparerebbe',noi:'impareremmo',voi:'imparereste',loro:'imparerebbero'},
      {io:'impari',tu:'impari',lui:'impari',noi:'impariamo',voi:'impariate',loro:'imparino'}
    ),null,['Sto imparando l\'italiano.'],['a1']),

  makeVerb('it_0480',480,'insegnare','to teach','are',false,
    conj(
      {io:'insegno',tu:'insegni',lui:'insegna',noi:'insegniamo',voi:'insegnate',loro:'insegnano'},
      'avere','insegnato',{io:'ho insegnato',tu:'hai insegnato',lui:'ha insegnato',noi:'abbiamo insegnato',voi:'avete insegnato',loro:'hanno insegnato'},
      {io:'insegnavo',tu:'insegnavi',lui:'insegnava',noi:'insegnavamo',voi:'insegnavate',loro:'insegnavano'},
      {io:'insegnerò',tu:'insegnerai',lui:'insegnerà',noi:'insegneremo',voi:'insegnerete',loro:'insegneranno'},
      {io:'insegnerei',tu:'insegneresti',lui:'insegnerebbe',noi:'insegneremmo',voi:'insegnereste',loro:'insegnerebbero'},
      {io:'insegni',tu:'insegni',lui:'insegni',noi:'insegniamo',voi:'insegniate',loro:'insegnino'}
    ),null,['Insegna italiano.'],['a1']),

  // 481-500: Final entries
  makeNoun('it_0481',481,'parco','park','masculine','parchi',['Vado al parco.'],['a1']),
  makeNoun('it_0482',482,'piazza','square/plaza','feminine','piazze',['Ci troviamo in piazza.'],['a1']),
  makeNoun('it_0483',483,'bar','bar/café','masculine','bar',['Vado al bar a fare colazione.'],['a1']),
  makeNoun('it_0484',484,'farmacia','pharmacy','feminine','farmacie',['Vado in farmacia.'],['a1']),
  makeNoun('it_0485',485,'banca','bank','feminine','banche',['Vado in banca.'],['a1']),
  makeNoun('it_0486',486,'posta','post office/mail','feminine',null,['Devo andare alla posta.'],['a1']),
  makeNoun('it_0487',487,'supermercato','supermarket','masculine','supermercati',['Faccio la spesa al supermercato.'],['a1']),
  makeNoun('it_0488',488,'spesa','shopping/expense','feminine','spese',['Faccio la spesa.'],['a1']),
  makeNoun('it_0489',489,'conto','bill/account','masculine','conti',['Il conto, per favore.'],['a1']),
  makeNoun('it_0490',490,'lista','list','feminine','liste',['Ho fatto la lista.'],['a1']),
  makeAdj('it_0491',491,'gratis','free (no cost)','gratis',['È gratis!'],['a1']),
  makeAdj('it_0492',492,'economico','cheap/economical','economici',['È un albergo economico.'],['a1']),
  makeAdj('it_0493',493,'comodo','comfortable/convenient','comodi',['Il divano è comodo.'],['a1']),
  makeAdj('it_0494',494,'moderno','modern','moderni',['È un edificio moderno.'],['a2']),
  makeAdj('it_0495',495,'antico','ancient/antique','antichi',['Questa città è antica.'],['a2']),
  makeAdv('it_0496',496,'ieri','yesterday',['Ieri ero a Milano.'],['a1']),
  makeAdv('it_0497',497,'oggi','today',['Oggi fa bello.'],['a1']),
  makeAdv('it_0498',498,'domani','tomorrow',['A domani!'],['a1']),
  makeAdv('it_0499',499,'dopodomani','the day after tomorrow',['Ci vediamo dopodomani.'],['a1']),
  makeAdv('it_0500',500,'ieri l\'altro','the day before yesterday',['Ieri l\'altro ero a casa.'],['a1']),
];

// Filter out placeholder/duplicate entries (those with italian field containing '—' or 'water — see')
const clean = entries.filter(e => !e.italian.includes('—') && !e.english.includes('—') && !e.english.includes('see'));

// Verify we have correct ranks 251-500
const firstRank = clean[0].rank;
const lastRank = clean[clean.length-1].rank;
console.log(`Generated ${clean.length} entries, ranks ${firstRank}-${lastRank}`);

// Check for duplicate ranks
const ranks = clean.map(e=>e.rank);
const dups = ranks.filter((r,i)=>ranks.indexOf(r)!==i);
if(dups.length) console.warn('Duplicate ranks:', dups);

fs.writeFileSync(path.join(__dirname, '../src/data/words-002.json'), JSON.stringify(clean, null, 2));
console.log('words-002.json written.');

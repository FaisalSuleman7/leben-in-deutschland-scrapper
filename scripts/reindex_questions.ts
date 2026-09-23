import * as fs from 'fs';
import * as path from 'path';
import { getCategoryForNum } from '../types/categories';

interface Question {
  num: string;
  question: string;
  a: string;
  b: string;
  c: string;
  d: string;
  solution: string;
  image?: string;
  translation?: Record<string, any>;
  category?: string | null;
  sessionId?: number;
  sessionName?: string;
  context?: string;
  id?: string;
}

// 300 Official BAMF Aufgaben definitions with matching signatures
// Each entry has:
// num: official number (1..300)
// match: function to uniquely identify the question in question.json
interface AufgabeMatcher {
  num: number;
  qSnippet: string; // Substring of question text (lowercased, punctuation removed)
  optSnippet?: string; // Substring of one of the options (for disambiguation)
}

function clean(str: string): string {
  return (str || '')
    .toLowerCase()
    .replace(/[„“"'\.,…\?\!\s\-_–—\(\)\/%\:;]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');
}

const OFFICIAL_AUFGABEN: AufgabeMatcher[] = [
  { num: 1, qSnippet: 'offenetwasgegendieregierungsagen' },
  { num: 2, qSnippet: 'elternbiszum14lebensjahr' },
  { num: 3, qSnippet: 'deutschlandisteinrechtsstaatwasistdamitgemeint' },
  { num: 4, qSnippet: 'welchesrechtgehörtzudengrundrechten', optSnippet: 'waffenbesitz' },
  { num: 5, qSnippet: 'wahlenindeutschlandsindfreiwasbedeutetdas', optSnippet: 'wederbeeinflusstnochzueiner' },
  { num: 6, qSnippet: 'wieheißtdiedeutscheverfassung' },
  { num: 7, qSnippet: 'nachderdeutschenverfassunggarantiert' },
  { num: 8, qSnippet: 'wasstehtnichtimgrundgesetz' },
  { num: 9, qSnippet: 'ausländer|auslaender|furausländer|nurfurausl' },
  { num: 10, qSnippet: 'mitdemdeutschengrundgesetzvereinbar' },
  { num: 11, qSnippet: 'wiewirddieverfassungderbundesrepublikdeutschlandgenannt' },
  { num: 12, qSnippet: 'diepressefreiheitabschaffen' },
  { num: 13, qSnippet: 'oppositionfür' },
  { num: 14, qSnippet: 'meinungsfreiheitindeutschlandheißtdassich' },
  { num: 15, qSnippet: 'wasverbietetdasdeutschegrundgesetz' },
  { num: 16, qSnippet: 'meinungsfreiheitindeutschlandeingeschraenkt' },
  { num: 17, qSnippet: 'deutschengesetzeverbieten' },
  { num: 18, qSnippet: 'inartikel1desgrundgesetzes' },
  { num: 19, qSnippet: 'freizügigkeitindeutschland' },
  { num: 20, qSnippet: 'einediktaturzuerrichten' },
  { num: 21, qSnippet: 'wappenderbundesrepublik' },
  { num: 22, qSnippet: 'wasfüreinestaatsformhatdeutschland' },
  { num: 23, qSnippet: 'diemeistenerwerbstätigen' },
  { num: 24, qSnippet: 'wievielebundesländerhatdiebundesrepublik' },
  { num: 25, qSnippet: 'keinbundeslandderbundesrepublik' },
  { num: 26, qSnippet: 'deutschlandist', optSnippet: 'demokratischerundsozialerbundesstaat' },
  { num: 27, qSnippet: 'deutschlandist', optSnippet: 'sozialistischerstaat' },
  { num: 28, qSnippet: 'dieabgeordnetenzumbundestag' },
  { num: 29, qSnippet: 'wappentierderbundesrepublik' },
  { num: 30, qSnippet: 'keinmerkmalunsererdemokratie' },
  { num: 31, qSnippet: 'zusammenarbeitvonparteienzurbildung' },
  { num: 32, qSnippet: 'keinestaatlichegewalt', optSnippet: 'presse' },
  { num: 33, qSnippet: 'welcheaussageistrichtigindeutschland' },
  { num: 34, qSnippet: 'wasistdeutschlandnicht' },
  { num: 35, qSnippet: 'sozialversicherung', optSnippet: 'kirchensteuer' },
  { num: 36, qSnippet: 'schafftindeutschlandsozialesicherheit' },
  { num: 37, qSnippet: 'regierungschefinnenregierungschefsdermeistenbundesländer' },
  { num: 38, qSnippet: 'ein-demokratischer-und-sozialer|demokratischerundsozialer', optSnippet: 'staatenverbund' },
  { num: 39, qSnippet: 'washatjedesdeutschebundesland' },
  { num: 40, qSnippet: 'mitwelchenwortenbeginntdiedeutschenationalhymne' },
  { num: 41, qSnippet: 'mehralseinepartei' },
  { num: 42, qSnippet: 'einneuesgesetz' },
  { num: 43, qSnippet: 'parteiverbotenwerden' },
  { num: 44, qSnippet: 'nichtdirektwählen' },
  { num: 45, qSnippet: 'pflegeversicherung' },
  { num: 46, qSnippet: 'deutschestaathatvieleaufgabenwelcheaufgabegehörtdazu' },
  { num: 47, qSnippet: 'deutschestaathatvieleaufgabenwelcheaufgabegehörtnichtdazu' },
  { num: 48, qSnippet: 'gehörtnichtzudenverfassungsorganen' },
  { num: 49, qSnippet: 'bestimmtindeutschlanddieschulpolitik' },
  { num: 50, qSnippet: 'wirtschaftsformin' },
  { num: 51, qSnippet: 'zueinemdemokratischenrechtsstaatgehörtesnicht' },
  { num: 52, qSnippet: 'volkssouveränitätallestaatsgewalt' },
  { num: 53, qSnippet: 'rechtsstaatindeutschland', optSnippet: 'derstaatmussdiegesetzeeinhalten' },
  { num: 54, qSnippet: 'keinestaatlichegewalt', optSnippet: 'direktive' },
  { num: 55, qSnippet: 'zeigt-dieses-bild|waszeigtdiesesbild', optSnippet: 'bundestagssitzinberlin' },
  { num: 56, qSnippet: 'gemeindeverwaltung' },
  { num: 57, qSnippet: 'präsidentendesdeutschenbundestages' },
  { num: 58, qSnippet: 'ernenntindeutschlanddieministerinnen' },
  { num: 59, qSnippet: 'erstmalseinejüdischegemeinde' },
  { num: 60, qSnippet: 'bundestagundderbundesratzur' },
  { num: 61, qSnippet: 'volkssouveränität', optSnippet: 'diestaatsgewaltgehtvomvolkeaus' },
  { num: 62, qSnippet: 'parlamenteinesdeutschenbundeslandesgewählt' },
  { num: 63, qSnippet: 'nichtzurexekutive' },
  { num: 64, qSnippet: 'heutegegliedertin' },
  { num: 65, qSnippet: 'gehörtnichtzudenaufgabendesdeutschenbundestages' },
  { num: 66, qSnippet: 'größtenjüdischengemeinden' },
  { num: 67, qSnippet: 'vorallemeineaufgabederbundesländer' },
  { num: 68, qSnippet: 'kontrolliertderstaatindeutschlanddasschulwesen' },
  { num: 69, qSnippet: 'dreistufigen' },
  { num: 70, qSnippet: 'gustavheinemann' },
  { num: 71, qSnippet: 'wohaeltsich|amhaeufigstenauf' },
  { num: 72, qSnippet: 'jetzigebundeskanzler' },
  { num: 73, qSnippet: 'größtenfraktionen' },
  { num: 74, qSnippet: 'parlamentfürganzdeutschland' },
  { num: 75, qSnippet: 'heutigesstaatsoberhaupt' },
  { num: 76, qSnippet: 'abkürzungcdu' },
  { num: 77, qSnippet: 'bundeswehr' },
  { num: 78, qSnippet: 'abkürzungspd' },
  { num: 79, qSnippet: 'abkürzungfdp' },
  { num: 80, qSnippet: 'auslegungdesgrundgesetzes' },
  { num: 81, qSnippet: 'wähltdiebundeskanzlerin', optSnippet: 'bundestag' },
  { num: 82, qSnippet: 'leitetdasdeutschebundeskabinett' },
  { num: 83, qSnippet: 'wähltdiedeutschebundeskanzlerin', optSnippet: 'bundesregierung' },
  { num: 84, qSnippet: 'hauptaufgabehatdied パ |hauptaufgabehatdied' },
  { num: 85, qSnippet: 'bildetdendeutschenbundesrat' },
  { num: 86, qSnippet: 'wähltindeutschlanddiebundespräsidentin' },
  { num: 87, qSnippet: 'staatsoberhauptderbundesrepublik' },
  { num: 88, qSnippet: 'parlamentarischeopposition' },
  { num: 89, qSnippet: 'abgeordneteneinerparteiimparlament' },
  { num: 90, qSnippet: 'wirkenandergesetzgebungdesbundesmit' },
  { num: 91, qSnippet: 'regierungswechselineinembundesland' },
  { num: 92, qSnippet: 'abkürzungcsu' },
  { num: 93, qSnippet: 'zweitstimmen' },
  { num: 94, qSnippet: 'wahldezdeutschenbundestag|wahlzumdeutschenbundestag' },
  { num: 95, qSnippet: 'meistenkinderindeutschland' },
  { num: 96, qSnippet: 'holocaustleugnetbestraft' },
  { num: 97, qSnippet: 'bezahltmanindeutschlandautomatischwennmanfestangestellt' },
  { num: 98, qSnippet: 'ihrefraktionwechseln' },
  { num: 99, qSnippet: 'werbezahltindeutschlanddiesozialversicherungen' },
  { num: 100, qSnippet: 'nichtzurgesetzlichensozialversicherung' },
  { num: 101, qSnippet: 'gewerkschaftensindinteressenverbände' },
  { num: 102, qSnippet: 'bundesverdienstkreuz|geehrtwerden' },
  { num: 103, qSnippet: 'ampelkoalition' },
  { num: 104, qSnippet: 'verliertihrearbeit' },
  { num: 105, qSnippet: 'aufgabevonwahlhelferinnenwahlhelfernindeutschland', optSnippet: 'wahlkabine' },
  { num: 106, qSnippet: 'wahlhelfer', optSnippet: 'journalisten' },
  { num: 107, qSnippet: 'fürwievielejahrewirdderbundestag', optSnippet: '6jahre' },
  { num: 108, qSnippet: 'darfjederwählen' },
  { num: 109, qSnippet: 'normalerweisebundestagswahlen' },
  { num: 110, qSnippet: 'fürwievielejahrewirdderbundestag', optSnippet: '3jahre' },
  { num: 111, qSnippet: 'staat-israel-sind-in-deutschland-verboten|handlungeenmitbezugaufdenstaatisrael' },
  { num: 112, qSnippet: 'wahlenindeutschlandsindspeziell|wahlenindeutschlandsind' },
  { num: 113, qSnippet: 'gewinntdieparteidie' },
  { num: 114, qSnippet: 'andemokratischenwahlenindeutschlandteilzunehmen' },
  { num: 115, qSnippet: 'aktiveswahlrechtindeutschland' },
  { num: 116, qSnippet: 'bundestagswahlindeutschlandwählendürfenheißtdas' },
  { num: 117, qSnippet: 'wievielprozentderzweitstimmenmüssenparteienmindestens' },
  { num: 118, qSnippet: 'makkabi' },
  { num: 119, qSnippet: 'wahlenindeutschlandsindfreiwasbedeutetdas', optSnippet: 'straftäterinnen' },
  { num: 120, qSnippet: 'wahlsystemindeutschlandistein' },
  { num: 121, qSnippet: 'mindestanteilanwählerstimmenhabendasheißt' },
  { num: 122, qSnippet: 'welchemgrundsatzunterliegenwahlen' },
  { num: 123, qSnippet: 'wasistindeutschlanddie5huerde|5huerde', optSnippet: 'mindestanteil' },
  { num: 124, qSnippet: 'bundestagswahlindeutschlandistdiewahl' },
  { num: 125, qSnippet: 'funktionvonregelmäßigenwahlen' },
  { num: 126, qSnippet: 'vor-einer-wahl|voreinerwahl', optSnippet: 'wahlbenachrichtigung' },
  { num: 127, qSnippet: 'warumgibtesdie5huerde' },
  { num: 128, qSnippet: 'parlamentsmitglieder' },
  { num: 129, qSnippet: 'vomvolkgewähltwird' },
  { num: 130, qSnippet: 'stimmzettelwärebeieinerbundestagswahlgültig' },
  { num: 131, qSnippet: 'bürgermeisterin' },
  { num: 132, qSnippet: 'ehrenamtlichwasbedeutet' },
  { num: 133, qSnippet: 'bundestags-und-landtagswahlen-in-deutschland-erlaubt|landtagswahlenindeutschlanderlaubt' },
  { num: 134, qSnippet: 'buslinie' },
  { num: 135, qSnippet: 'wenvertretendiegewerkschaften' },
  { num: 136, qSnippet: 'arbeitsgerichtbei', optSnippet: 'nebenkostenabrechnung' },
  { num: 137, qSnippet: 'konflikteninderarbeitswelt' },
  { num: 138, qSnippet: 'unrechtgekündigt' },
  { num: 139, qSnippet: 'prozessvorgericht' },
  { num: 140, qSnippet: 'schöffe' },
  { num: 141, qSnippet: 'berätindeutschlandpersonenbeirechtsfragen' },
  { num: 142, qSnippet: 'hauptaufgabeeinerrichterin' },
  { num: 143, qSnippet: 'richterinindeutschlandgehörtzur|richterindeutschlandgehörtzur', optSnippet: 'operative' },
  { num: 144, qSnippet: 'richteringehörtindeutschlandzur|richtergehörtindeutschlandzur', optSnippet: 'planenden' },
  { num: 145, qSnippet: 'staatsgewaltgeteiltfürwelchestaatsgewalt' },
  { num: 146, qSnippet: 'verfahrenvoreinemgericht' },
  { num: 147, qSnippet: 'arbeiteinesrichters|arbeiteinerrichterin' },
  { num: 148, qSnippet: 'aufgabederpolizei' },
  { num: 149, qSnippet: 'antisemitischesverhalten' },
  { num: 150, qSnippet: 'gerichtsschöffin' },
  { num: 151, qSnippet: 'werbautediemauerinberlin' },
  { num: 152, qSnippet: 'adolfhitlerindeutschlandandermacht' },
  { num: 153, qSnippet: '8mai1945' },
  { num: 154, qSnippet: 'zweiteweltkriegzuende' },
  { num: 155, qSnippet: 'nationalsozialistenindeutschlandandermacht' },
  { num: 156, qSnippet: 'hitlerreichskanzler' },
  { num: 157, qSnippet: '1933indeutschland' },
  { num: 158, qSnippet: 'drittereichwareine' },
  { num: 159, qSnippet: 'nichtwährendderzeitdesnationalsozialismus' },
  { num: 160, qSnippet: '1939bis1945' },
  { num: 161, qSnippet: 'nsstaat' },
  { num: 162, qSnippet: 'stauffenberg' },
  { num: 163, qSnippet: 'zerstörtendienationalsozialistensynagogen' },
  { num: 164, qSnippet: '9november1938' },
  { num: 165, qSnippet: 'erstebundeskanzlerderbundesrepublik' },
  { num: 166, qSnippet: 'wirsinddasvolk' },
  { num: 167, qSnippet: 'alliertebesatzungsmächte|alliiertebesatzungsmächte', optSnippet: 'polen' },
  { num: 168, qSnippet: 'keinealliiertebesatzungsmacht|keinealliertebesatzungsmacht' },
  { num: 169, qSnippet: 'bundesrepublikdeutschlandgegründet' },
  { num: 170, qSnippet: 'währendderzeitdesnationalsozialismusindeutschland' },
  { num: 171, qSnippet: 'sozialemarktwirtschaftbedeutet' },
  { num: 172, qSnippet: 'besatzungszonewurdedieddrgegründet' },
  { num: 173, qSnippet: 'gründungsmitglied' },
  { num: 174, qSnippet: 'wannwurdedieddrgegründet' },
  { num: 175, qSnippet: 'wievielebesatzungszonengabes' },
  { num: 176, qSnippet: 'besatzungszonendeutschlandsnach1945verteilt' },
  { num: 177, qSnippet: 'deutschestadtwurdenachdemzweitenweltkrieginviersektorenaufgeteilt' },
  { num: 178, qSnippet: 'luftbrücke' },
  { num: 179, qSnippet: 'endetederzweiteweltkriegineuropaoffiziell' },
  { num: 180, qSnippet: 'erste-bundeskanzler-der-bundesrepublik-deutschland-war|erstebundeskanzlerderbundesrepublikdeutschlandwar' },
  { num: 181, qSnippet: 'willybrandtmitseinemkniefall1970' },
  { num: 182, qSnippet: 'jüdischegebetshaus' },
  { num: 183, qSnippet: 'wirtschaftswunder' },
  { num: 184, qSnippet: 'rechtlichengrundlagewurdederstaatisraelgegründet' },
  { num: 185, qSnippet: 'eisernervorhang' },
  { num: 186, qSnippet: 'aufstandandenlangezeit' },
  { num: 187, qSnippet: 'hammerzirkelundährenkranz' },
  { num: 188, qSnippet: 'inwelchemjahrwurdediemauerinberlingebaut' },
  { num: 189, qSnippet: 'wannbautedieddr' },
  { num: 190, qSnippet: 'abkürzungddr' },
  { num: 191, qSnippet: 'für-alle-geöffnet|fürallegeöffnet' },
  { num: 192, qSnippet: 'früherzumgebietderddr', optSnippet: 'brandenburg' },
  { num: 193, qSnippet: '1961bis1989warberlin' },
  { num: 194, qSnippet: '3oktober' },
  { num: 195, qSnippet: 'früherzumgebietderddr', optSnippet: 'sachsenanhalt' },
  { num: 196, qSnippet: 'herbst1989inderddrdiewende' },
  { num: 197, qSnippet: 'früherzumgebietderddr', optSnippet: 'thüringen' },
  { num: 198, qSnippet: 'früherzumgebietderddr', optSnippet: 'niedersachsen' },
  { num: 199, qSnippet: 'abkürzungstasi' },
  { num: 200, qSnippet: 'früherzumgebietderddr', optSnippet: 'mecklenburgvorpommern' },
  { num: 201, qSnippet: 'nurbundesländerdiezumgebietderfrüherenddrgehörten' },
  { num: 202, qSnippet: 'ddrimkaltenkrieg' },
  { num: 203, qSnippet: 'wirtschaftssystemderddr' },
  { num: 204, qSnippet: 'ddrzueinemstaat' },
  { num: 205, qSnippet: 'beitrittderddrzurbundesrepublikdeutschlandgehörendieneuenbundesländernunauch' },
  { num: 206, qSnippet: 'stolpersteine' },
  { num: 207, qSnippet: 'militärbündniswardieddrmitglied' },
  { num: 208, qSnippet: 'waswardiestasi' },
  { num: 209, qSnippet: 'wappenderdeutschendemokratischenrepublik' },
  { num: 210, qSnippet: '17juni1953inderddr' },
  { num: 211, qSnippet: 'ostverträge' },
  { num: 212, qSnippet: 'vollem-namen|vollemnamen' },
  { num: 213, qSnippet: 'wievieleeinwohnerhatdeutschland' },
  { num: 214, qSnippet: 'farbenhatdiedeutscheflagge' },
  { num: 215, qSnippet: 'kanzlerderdeutscheneinheit' },
  { num: 216, qSnippet: 'plenarsaaldesdeutschenbundestages' },
  { num: 217, qSnippet: 'zeitraumgabesdiedeutschedemokratischerepublik' },
  { num: 218, qSnippet: 'wiedervereinigung1990zurbundesrepublikdeutschlandhinzu' },
  { num: 219, qSnippet: 'grenzenvonheuteseit' },
  { num: 220, qSnippet: '27januar' },
  { num: 221, qSnippet: 'schengenerabkommens' },
  { num: 222, qSnippet: 'nachbarlandvondeutschland', optSnippet: 'schweiz' },
  { num: 223, qSnippet: 'nachbarlandvondeutschland', optSnippet: 'polen' },
  { num: 224, qSnippet: 'abkürzungeu' },
  { num: 225, qSnippet: 'deutschsprachigebevölkerung' },
  { num: 226, qSnippet: 'flaggedereuropäischenunion' },
  { num: 227, qSnippet: 'nachbarlandvondeutschland', optSnippet: 'dänemark' },
  { num: 228, qSnippet: 'beitrittderddrzurbundesrepublikdeutschlandimjahr1990allgemeingenannt' },
  { num: 229, qSnippet: 'nachbarlandvondeutschland', optSnippet: 'luxemburg' },
  { num: 230, qSnippet: 'europäischeparlamentwirdregelmäßiggewählt' },
  { num: 231, qSnippet: 'europäischeintegration' },
  { num: 232, qSnippet: 'beidereuropawahlgewählt' },
  { num: 233, qSnippet: 'nachbarlandvondeutschland', optSnippet: 'tschechien' },
  { num: 234, qSnippet: 'sitzdeseuropäischenparlaments' },
  { num: 235, qSnippet: 'mitterrand|verdun' },
  { num: 236, qSnippet: 'mitgliedstaatenhatdieeuheute' },
  { num: 237, qSnippet: '50-jährige-jubiläum|50jährigejubiläum' },
  { num: 238, qSnippet: 'welchenortenarbeitetdaseuropäischeparlament' },
  { num: 239, qSnippet: 'welcheverträgeschlosssichdiebundesrepublik' },
  { num: 240, qSnippet: 'euroinbar' },
  { num: 241, qSnippet: 'elterngeld' },
  { num: 242, qSnippet: 'kindergartengeht' },
  { num: 243, qSnippet: 'maikundsybille' },
  { num: 244, qSnippet: 'universität-in-deutschland-ein-studium-zu-beginnen|studiumzubeginnen' },
  { num: 245, qSnippet: 'nichtalspaarzusammenleben' },
  { num: 246, qSnippet: 'abwelchemalteristmanindeutschlandvolljährig' },
  { num: 247, qSnippet: 'frauitschwanger|frauistschwanger' },
  { num: 248, qSnippet: 'erziehungderkinderistindeutschlandvorallemaufgabe' },
  { num: 249, qSnippet: 'hauptsächlichverantwortlichfürdiekindererziehung' },
  { num: 250, qSnippet: 'bestenchancenaufeinengutbezahltenarbeitsplatz' },
  { num: 251, qSnippet: 'einkindschlägt' },
  { num: 252, qSnippet: 'zurgleichenzeitnurmiteinerpartnerin|indeutschland', optSnippet: 'ehepartner' },
  { num: 253, qSnippet: 'indeutschlandumziehen' },
  { num: 254, qSnippet: 'trennungsjahr' },
  { num: 255, qSnippet: 'erziehungsproblemenkönnenelternindeutschlandhilfeerhalten' },
  { num: 256, qSnippet: 'restauranteröffnen' },
  { num: 257, qSnippet: 'erwachsenefraumöchteindeutschlanddasabiturnachholen' },
  { num: 258, qSnippet: 'darfdasjugendamt' },
  { num: 259, qSnippet: 'berufsinformationszentrumbiz' },
  { num: 260, qSnippet: 'kindinderschool|kindindersschule|kindinderschule' },
  { num: 261, qSnippet: 'mannmöchtemit30jahren' },
  { num: 262, qSnippet: 'grundsatzdergleichbehandlung' },
  { num: 263, qSnippet: 'ab14jahrenstrafmündig' },
  { num: 264, qSnippet: 'buntekostümeundmasken' },
  { num: 265, qSnippet: 'heiratenmöchte' },
  { num: 266, qSnippet: 'gesetzlichenachtruhe' },
  { num: 267, qSnippet: '22jahrealtlebtmitihremfreundzusammen' },
  { num: 268, qSnippet: 'führerscheinmachen' },
  { num: 269, qSnippet: 'dreijahrenbiszurersteinschulung' },
  { num: 270, qSnippet: 'volkshochschule' },
  { num: 271, qSnippet: 'weihnachten' },
  { num: 272, qSnippet: 'lebensformistindeutschlandnichterlaubt' },
  { num: 273, qSnippet: 'erziehungsproblemengehensi' },
  { num: 274, qSnippet: 'briefgeöffnet' },
  { num: 275, qSnippet: 'ehescheidung' },
  { num: 276, qSnippet: 'deutschenbehördeschlechtbehandelt' },
  { num: 277, qSnippet: 'zweijährigeskindhatbewirbtsich' },
  { num: 278, qSnippet: 'mannimrollstuhl' },
  { num: 279, qSnippet: 'hausordnung' },
  { num: 280, qSnippet: 'falschensteuerbescheidwehren' },
  { num: 281, qSnippet: 'schwimmbadindeutschlandbeidehabeneinedunklehautfarbe' },
  { num: 282, qSnippet: 'ehrenamtmüssendeutschestaatsbürgerinnen' },
  { num: 283, qSnippet: 'falscherechnungvoneinerdeutschenbehörde' },
  { num: 284, qSnippet: 'fürdiearbeitkönnenmussändertsichinzukunftsehrschnell' },
  { num: 285, qSnippet: 'fraufrostarbeitet' },
  { num: 286, qSnippet: 'organisationineinerfirma' },
  { num: 287, qSnippet: 'arbeitsverhältnisbeenden' },
  { num: 288, qSnippet: 'besondereverantwortungfürisrael' },
  { num: 289, qSnippet: 'dunklerhautfarbebewirbtsichumeinestellealskellner' },
  { num: 290, qSnippet: 'fernsehergekauft' },
  { num: 291, qSnippet: 'steuererklärungaufschreibenobmanzueinerkirchegehört' },
  { num: 292, qSnippet: 'religiösentoleranz' },
  { num: 293, qSnippet: 'ostern' },
  { num: 294, qSnippet: 'pfingsten' },
  { num: 295, qSnippet: 'welchereligionhatdieeuropäischeunddeutschekulturgeprägt' },
  { num: 296, qSnippet: 'letztenvierwochenvorweihnachten' },
  { num: 297, qSnippet: 'meistenmigranten' },
  { num: 298, qSnippet: 'ddrlebtenvorallemmigrantinnen' },
  { num: 299, qSnippet: 'in-den-50er-und-60er-jahren|50erund60erjahrenvorderbundesrepublikdeutschlandangeworben' },
  { num: 300, qSnippet: 'gastarbeiterundgastarbeiterinnen' }
];

export function runReindex() {
  const filePath = path.join(process.cwd(), 'data', 'question.json');
  const allQuestions: Question[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const generalQuestions = allQuestions.filter(q => !q.num || !q.num.includes('-'));
  const stateQuestions = allQuestions.filter(q => q.num && q.num.includes('-'));

  console.log(`Initial total questions: ${allQuestions.length}`);
  console.log(`General questions: ${generalQuestions.length}`);
  console.log(`State questions: ${stateQuestions.length}`);

  const matchedAufgaben = new Map<number, Question>();
  const unmatchedAufgaben: number[] = [];
  const assignedGeneral = new Set<Question>();

  for (const aufgabe of OFFICIAL_AUFGABEN) {
    const qSnippets = aufgabe.qSnippet.split('|');
    const optSnippetClean = aufgabe.optSnippet ? clean(aufgabe.optSnippet) : null;

    let candidate: Question | undefined;

    // First try: exact match on snippet and option snippet
    const candidates = generalQuestions.filter(g => {
      if (assignedGeneral.has(g)) return false;
      const gCleanQ = clean(g.question);
      const qMatch = qSnippets.some(s => gCleanQ.includes(clean(s)));
      if (!qMatch) return false;

      if (optSnippetClean) {
        const optMatch = [g.a, g.b, g.c, g.d].some(opt => clean(opt).includes(optSnippetClean));
        return optMatch;
      }
      return true;
    });

    if (candidates.length === 1) {
      candidate = candidates[0];
    } else if (candidates.length > 1) {
      // Disambiguate by checking options
      if (optSnippetClean) {
        candidate = candidates.find(g => [g.a, g.b, g.c, g.d].some(opt => clean(opt).includes(optSnippetClean)));
      }
      if (!candidate) {
        candidate = candidates[0];
      }
    }

    if (candidate) {
      matchedAufgaben.set(aufgabe.num, candidate);
      assignedGeneral.add(candidate);
    } else {
      unmatchedAufgaben.push(aufgabe.num);
    }
  }

  console.log(`Matched ${matchedAufgaben.size} / 300 Aufgaben.`);
  if (unmatchedAufgaben.length > 0) {
    console.warn(`Unmatched Aufgaben: ${unmatchedAufgaben.join(', ')}`);
    return;
  }

  // Update every matched general question
  const updatedGeneralQuestions: Question[] = [];
  for (let i = 1; i <= 300; i++) {
    const q = matchedAufgaben.get(i);
    if (!q) {
      throw new Error(`Missing Aufgabe ${i}`);
    }
    const catInfo = getCategoryForNum(i);
    q.num = String(i);
    q.category = catInfo.category;
    q.sessionId = catInfo.sessionId;
    q.sessionName = catInfo.sessionName;
    updatedGeneralQuestions.push(q);
  }

  // Process state questions
  const updatedStateQuestions = stateQuestions.map(sq => {
    return {
      ...sq,
      category: sq.context ? `${sq.context}` : 'Bundesland',
      sessionId: 0,
      sessionName: sq.context ? `${sq.context}` : 'Bundesland'
    };
  });

  const finalQuestions = [...updatedGeneralQuestions, ...updatedStateQuestions];

  fs.writeFileSync(filePath, JSON.stringify(finalQuestions, null, 2), 'utf8');
  console.log(`Successfully wrote ${finalQuestions.length} questions to ${filePath}`);
  console.log(`- General questions: ${updatedGeneralQuestions.length} (indexed 1..300 with 20 official categories)`);
  console.log(`- State questions: ${updatedStateQuestions.length}`);

  return { matchedAufgaben, updatedGeneralQuestions, updatedStateQuestions, finalQuestions };
}

if (require.main === module) {
  runReindex();
}

/* ───────────────────────── real data: the early rock and metal family tree ─────────────────────────
   Hand-compiled. One block per act:  Name | genre code | city | formed-ended | studio albums
   "+ person; role; years" is a member, "~ person; weight; year; what they did" is a guest, "* A × B; what" is a joint release. */
export const ROCK_GENRES = { RR:["Rock & roll and R&B","#f2b134"], BEAT:["Beat and British Invasion","#4d7cfe"], BLUES:["Blues and blues rock","#2ec4b6"], PSY:["Psychedelic rock","#b86bd9"], HARD:["Hard rock","#ef6f4a"], METAL:["Heavy metal","#9aa3b5"], PROG:["Progressive rock","#ff8fc7"], GLAM:["Glam and art rock","#e83f6f"], POP:["Pop rock and solo Beatles","#6fd3f7"], FOLK:["Folk and country rock","#8ab661"] };
const ROCK = `
Elvis Presley (solo) | RR | Memphis | 1954-1977 | 24
+ Elvis Presley; vocals
+ Scotty Moore; guitar; 1954-68
+ Bill Black; bass; 1954-58
+ D.J. Fontana; drums; 1955-68
+ James Burton; guitar; 1969-77
+ Glen D. Hardin; piano; 1970-76
+ Ron Tutt; drums; 1969-77
+ Jerry Scheff; bass; 1969-77

Chuck Berry (solo) | RR | St. Louis | 1955-2017 | 20
+ Chuck Berry; vocals, guitar
+ Johnnie Johnson; piano
~ Kenney Jones; 3; 1972; drums on The London Chuck Berry Sessions
~ Ian McLagan; 3; 1972; piano on The London Chuck Berry Sessions
~ Keith Richards; 3; 1986; led the band for Hail! Hail! Rock 'n' Roll
~ Eric Clapton; 1; 1986; guest in Hail! Hail! Rock 'n' Roll

Little Richard (solo) | RR | Macon | 1951-2020 | 0
+ Little Richard; vocals, piano
+ Jimi Hendrix; touring guitar; 1964-65
+ Billy Preston; touring organ; 1962

The Isley Brothers | RR | Cincinnati | 1954- | 0
+ Ronald Isley; vocals
+ Ernie Isley; guitar
+ Jimi Hendrix; guitar; 1964

The Crickets | RR | Lubbock | 1957- | 0
+ Buddy Holly; vocals, guitar; 1957-58
+ Jerry Allison; drums
+ Joe B. Mauldin; bass
+ Niki Sullivan; guitar; 1957
+ Sonny Curtis; guitar, vocals
+ Glen D. Hardin; piano
+ Albert Lee; guitar; 1973-74
+ Ric Grech; bass; 1973-74

The Everly Brothers | RR | Nashville | 1956-2005 | 21
+ Don Everly; vocals, guitar
+ Phil Everly; vocals, guitar
+ Albert Lee; guitar, musical director; 1983-2005

Jerry Lee Lewis (solo) | RR | Ferriday | 1956-2022 | 40
+ Jerry Lee Lewis; vocals, piano
~ Albert Lee; 5; 1973; guitar on The Session, cut in London
~ Peter Frampton; 3; 1973; guitar on The Session
~ Rory Gallagher; 3; 1973; guitar on The Session
~ Alvin Lee; 3; 1973; guitar on The Session
~ Kenney Jones; 5; 1973; drums on The Session
~ Klaus Voormann; 3; 1973; bass on The Session
~ Chas Hodges; 5; 1973; bass on The Session
~ Gary Wright; 2; 1973; organ on The Session
~ Jimmy Page; 1; 2006; Rock and Roll on Last Man Standing
~ Keith Richards; 1; 2006; duet on Last Man Standing
~ Mick Jagger; 1; 2006; duet on Last Man Standing
~ Ronnie Wood; 1; 2006; guitar on Last Man Standing
~ Ringo Starr; 1; 2006; duet on Last Man Standing
~ Eric Clapton; 1; 2006; guitar on Last Man Standing

The Shadows | BEAT | London | 1958- | 21
+ Hank Marvin; lead guitar
+ Bruce Welch; rhythm guitar
+ Jet Harris; bass; 1958-62
+ Tony Meehan; drums; 1959-61
+ Brian Bennett; drums; 1961-
+ John Rostill; bass; 1963-68

Jet Harris & Tony Meehan | BEAT | London | 1963-1964 | 0
+ Jet Harris; bass guitar
+ Tony Meehan; drums
+ John Paul Jones; touring bass; 1963-64
~ Jimmy Page; 1; 1963; session guitar on Diamonds

Johnny Kidd & the Pirates | BEAT | London | 1959-1966 | 0
+ Johnny Kidd; vocals
+ Mick Green; guitar; 1962-64
+ Nick Simper; bass; 1966

Screaming Lord Sutch and the Savages | BEAT | London | 1960-1999 | 3
+ Screaming Lord Sutch; vocals
+ Ritchie Blackmore; guitar; 1962, 1965
+ Carlo Little; drums
+ Nicky Hopkins; piano; 1960-62
~ Jimmy Page; 5; 1970; guitar and production on Lord Sutch and Heavy Friends
~ John Bonham; 5; 1970; drums on Lord Sutch and Heavy Friends
~ Jeff Beck; 2; 1970; guitar on Lord Sutch and Heavy Friends
~ Noel Redding; 3; 1970; bass on Lord Sutch and Heavy Friends
~ Keith Moon; 2; 1972; drums on Hands of Jack the Ripper
~ Nick Simper; 3; 1972; bass on Hands of Jack the Ripper

The Outlaws | BEAT | London | 1960-1965 | 1
+ Ritchie Blackmore; guitar; 1962-64
+ Chas Hodges; bass; 1960-65
+ Mick Underwood; drums; 1962-65
+ Ken Lundgren; guitar

Cyril Davies All-Stars | BLUES | London | 1962-1964 | 0
+ Cyril Davies; harmonica, vocals
+ Long John Baldry; vocals
+ Nicky Hopkins; piano
+ Carlo Little; drums

Alexis Korner's Blues Incorporated | BLUES | London | 1961-1966 | 5
+ Alexis Korner; guitar, vocals
+ Cyril Davies; harmonica; 1961-62
+ Charlie Watts; drums; 1962
+ Jack Bruce; bass; 1962-63
+ Ginger Baker; drums; 1962-63
+ Dick Heckstall-Smith; saxophone; 1962-63
+ Graham Bond; saxophone, organ; 1962-63
+ Long John Baldry; vocals; 1962
~ Mick Jagger; 2; 1962; guest singer at the Ealing Club
~ Brian Jones; 1; 1962; sat in on slide guitar

Graham Bond Organisation | BLUES | London | 1963-1970 | 2
+ Graham Bond; organ, saxophone, vocals
+ Jack Bruce; bass; 1963-65
+ Ginger Baker; drums; 1963-66
+ Dick Heckstall-Smith; saxophone; 1963-67
+ John McLaughlin; guitar; 1963
+ Jon Hiseman; drums; 1966-67

Georgie Fame and the Blue Flames | BEAT | London | 1961-1966 | 3
+ Georgie Fame; organ, vocals
+ Mitch Mitchell; drums; 1965-66
+ John McLaughlin; guitar; 1962-63

Steampacket | BEAT | London | 1965-1966 | 0
+ Long John Baldry; vocals
+ Rod Stewart; vocals
+ Julie Driscoll; vocals
+ Brian Auger; organ
+ Micky Waller; drums

Bluesology | BEAT | London | 1962-1968 | 0
+ Elton John; piano; 1962-67
+ Long John Baldry; vocals; 1966-68

John Mayall & the Bluesbreakers | BLUES | London | 1963-2008 | 35
+ John Mayall; vocals, harmonica, keyboards
+ John McVie; bass; 1963-67
+ Hughie Flint; drums; 1964-66
+ Eric Clapton; guitar; 1965-66
+ Jack Bruce; bass; 1965
+ Peter Green; guitar; 1966-67
+ Aynsley Dunbar; drums; 1966-67
+ Mick Fleetwood; drums; 1967
+ Mick Taylor; guitar; 1967-69
+ Keef Hartley; drums; 1967-68
+ Dick Heckstall-Smith; saxophone; 1967-68
+ Andy Fraser; bass; 1968
+ Jon Hiseman; drums; 1968
+ Tony Reeves; bass; 1968

The Beatles | BEAT | Liverpool | 1960-1970 | 12
+ John Lennon; vocals, guitar; 1960-69
+ Paul McCartney; vocals, bass; 1960-70
+ George Harrison; guitar, vocals; 1960-70
+ Ringo Starr; drums; 1962-70
+ Pete Best; drums; 1960-62
+ Stuart Sutcliffe; bass; 1960-61
~ Eric Clapton; 1; 1968; lead guitar on While My Guitar Gently Weeps
~ Billy Preston; 5; 1969; keyboards on the Get Back sessions
~ Brian Jones; 1; 1967; saxophone on You Know My Name

John Lennon and the Plastic Ono Band | POP | London | 1969-1975 | 6
+ John Lennon; vocals, guitar
+ Yoko Ono; vocals
+ Klaus Voormann; bass
+ Alan White; drums; 1969-71
+ Jim Keltner; drums; 1971-75
~ Eric Clapton; 5; 1969; guitar at Live Peace in Toronto
~ Ringo Starr; 5; 1970; drums on the Plastic Ono Band album
~ Billy Preston; 2; 1970; piano on God
~ George Harrison; 5; 1971; slide guitar on Imagine
~ Nicky Hopkins; 5; 1971; piano on Imagine
~ Elton John; 2; 1974; piano and vocals on Whatever Gets You thru the Night

The Dirty Mac | BLUES | London | 1968-1968 | 0
+ John Lennon; vocals, guitar
+ Eric Clapton; guitar
+ Keith Richards; bass
+ Mitch Mitchell; drums

George Harrison (solo) | POP | Liverpool | 1968-2001 | 12
+ George Harrison; vocals, guitar
~ Eric Clapton; 5; 1970; guitar on All Things Must Pass
~ Ringo Starr; 5; 1970; drums on All Things Must Pass
~ Billy Preston; 5; 1970; keyboards on All Things Must Pass
~ Klaus Voormann; 5; 1970; bass on All Things Must Pass
~ Bobby Whitlock; 5; 1970; keyboards on All Things Must Pass
~ Carl Radle; 5; 1970; bass on All Things Must Pass
~ Jim Gordon; 5; 1970; drums on All Things Must Pass
~ Gary Wright; 5; 1970; keyboards on All Things Must Pass
~ Gary Brooker; 2; 1970; piano on All Things Must Pass
~ Dave Mason; 2; 1970; guitar on All Things Must Pass
~ Alan White; 2; 1970; drums on All Things Must Pass
~ Peter Frampton; 2; 1970; uncredited acoustic guitar on All Things Must Pass
~ Ginger Baker; 1; 1970; drums on the Apple Jam
~ Jim Keltner; 5; 1971; drums at the Concert for Bangladesh and on later albums
~ Jeff Lynne; 5; 1987; co-producer and player on Cloud Nine
~ Elton John; 2; 1987; piano on Cloud Nine

Wings | POP | London | 1971-1981 | 7
+ Paul McCartney; vocals, bass
+ Linda McCartney; keyboards, vocals
+ Denny Laine; guitar, vocals
+ Denny Seiwell; drums; 1971-73
+ Henry McCullough; guitar; 1972-73
+ Jimmy McCulloch; guitar; 1974-77
+ Joe English; drums; 1975-77
+ Laurence Juber; guitar; 1978-81
+ Steve Holley; drums; 1978-81
~ John Bonham; 2; 1979; drums in the Rockestra on Back to the Egg
~ John Paul Jones; 2; 1979; bass and piano in the Rockestra
~ David Gilmour; 2; 1979; guitar in the Rockestra
~ Pete Townshend; 2; 1979; guitar in the Rockestra
~ Kenney Jones; 2; 1979; drums in the Rockestra
~ Hank Marvin; 2; 1979; guitar in the Rockestra
~ Gary Brooker; 2; 1979; piano in the Rockestra
~ Ronnie Lane; 2; 1979; bass in the Rockestra
~ Tony Ashton; 2; 1979; keyboards in the Rockestra
~ Ray Cooper; 2; 1979; percussion in the Rockestra

Thunderclap Newman | POP | London | 1969-1971 | 1
+ Andy Newman; piano
+ Speedy Keen; vocals, drums
+ Jimmy McCulloch; guitar
~ Pete Townshend; 5; 1969; producer and bassist on Hollywood Dream

Elton John (solo) | POP | London | 1969- | 31
+ Elton John; vocals, piano
+ Nigel Olsson; drums; 1970-75, 1980-84, 2000-
+ Dee Murray; bass; 1970-75, 1980-84
+ Davey Johnstone; guitar; 1971-
+ Ray Cooper; percussion; 1973-
~ Rick Wakeman; 3; 1971; organ on Madman Across the Water
~ John Lennon; 3; 1974; guitar on Lucy in the Sky with Diamonds, then on stage at Madison Square Garden

The Rolling Stones | BEAT | London | 1962- | 26
+ Mick Jagger; vocals
+ Keith Richards; guitar
+ Brian Jones; guitar; 1962-69
+ Ian Stewart; piano; 1962-85
+ Bill Wyman; bass; 1962-93
+ Charlie Watts; drums; 1963-2021
+ Mick Taylor; guitar; 1969-74
+ Ronnie Wood; guitar; 1975-
~ Nicky Hopkins; 5; 1967; piano from Between the Buttons to Black and Blue
~ Bobby Keys; 5; 1969; saxophone on records and tours
~ Jim Price; 5; 1970; horns on Sticky Fingers and Exile on Main St.
~ Billy Preston; 5; 1973; keyboards on records and tours
~ John Lennon; 1; 1967; backing vocals on We Love You
~ Paul McCartney; 1; 1967; backing vocals on We Love You
~ Pete Townshend; 1; 1981; backing vocals on Slave
~ Jimmy Page; 1; 1986; guitar on One Hit (to the Body)

Bill Wyman's Rhythm Kings | BLUES | London | 1997- | 6
+ Bill Wyman; bass
+ Albert Lee; guitar
+ Georgie Fame; organ, vocals
+ Gary Brooker; piano, vocals
+ Peter Frampton; guitar
+ Andy Fairweather Low; guitar, vocals
~ Eric Clapton; 2; 1997; guitar on Struttin' Our Stuff
~ George Harrison; 1; 2001; slide guitar on Love Letters

Howlin' Wolf (solo) | BLUES | Chicago | 1951-1976 | 0
+ Howlin' Wolf; vocals, harmonica
+ Hubert Sumlin; guitar
~ Eric Clapton; 5; 1971; guitar on The London Howlin' Wolf Sessions
~ Steve Winwood; 5; 1971; keyboards on The London Howlin' Wolf Sessions
~ Bill Wyman; 5; 1971; bass on The London Howlin' Wolf Sessions
~ Charlie Watts; 5; 1971; drums on The London Howlin' Wolf Sessions
~ Ian Stewart; 3; 1971; piano on The London Howlin' Wolf Sessions
~ Ringo Starr; 1; 1971; drums on I Ain't Superstitious
~ Klaus Voormann; 1; 1971; bass on I Ain't Superstitious

The Kinks | BEAT | London | 1963-1996 | 24
+ Ray Davies; vocals, guitar
+ Dave Davies; guitar
+ Pete Quaife; bass; 1963-69
+ Mick Avory; drums; 1964-84
~ Jimmy Page; 2; 1964; session rhythm guitar on the debut album
~ Nicky Hopkins; 5; 1965; piano from The Kink Kontroversy to Village Green

The Who | BEAT | London | 1964- | 12
+ Roger Daltrey; vocals
+ Pete Townshend; guitar
+ John Entwistle; bass; 1964-2002
+ Keith Moon; drums; 1964-78
+ Kenney Jones; drums; 1978-88
+ John Bundrick; touring keyboards; 1979-2011
+ Simon Phillips; touring drums; 1989
~ Nicky Hopkins; 5; 1965; piano on My Generation and Who's Next
~ Jimmy Page; 1; 1965; session guitar on the I Can't Explain single

The Animals | BEAT | Newcastle | 1963-1968 | 5
+ Eric Burdon; vocals
+ Alan Price; organ; 1963-65
+ Hilton Valentine; guitar; 1963-66
+ Chas Chandler; bass; 1963-66
+ John Steel; drums; 1963-66

Manfred Mann | BEAT | London | 1962-1969 | 5
+ Manfred Mann; keyboards
+ Paul Jones; vocals; 1962-66
+ Mike Hugg; drums
+ Tom McGuinness; bass, guitar
+ Jack Bruce; bass; 1965-66
+ Klaus Voormann; bass; 1966-69
+ Mike d'Abo; vocals; 1966-69

Manfred Mann's Earth Band | PROG | London | 1971- | 16
+ Manfred Mann; keyboards
+ Mick Rogers; guitar, vocals
+ Colin Pattenden; bass; 1971-77
+ Chris Slade; drums; 1971-78
+ Chris Thompson; vocals; 1975-

The Spencer Davis Group | BEAT | Birmingham | 1963-1969 | 5
+ Spencer Davis; guitar, vocals
+ Steve Winwood; vocals, organ; 1963-67
+ Muff Winwood; bass; 1963-67
+ Pete York; drums; 1963-69
+ Nigel Olsson; drums; 1969
+ Dee Murray; bass; 1969

The Moody Blues | PROG | Birmingham | 1964-2018 | 16
+ Denny Laine; guitar, vocals; 1964-66
+ Mike Pinder; keyboards; 1964-78
+ Ray Thomas; flute, vocals; 1964-2002
+ Graeme Edge; drums; 1964-2018
+ Justin Hayward; guitar, vocals; 1966-2018
+ John Lodge; bass, vocals; 1966-2018
+ Patrick Moraz; keyboards; 1978-91

The Move | PSY | Birmingham | 1965-1972 | 4
+ Roy Wood; guitar, vocals
+ Carl Wayne; vocals; 1965-70
+ Trevor Burton; guitar, bass; 1965-69
+ Ace Kefford; bass; 1965-68
+ Bev Bevan; drums
+ Jeff Lynne; guitar, vocals; 1970-72

Electric Light Orchestra | POP | Birmingham | 1970- | 14
+ Jeff Lynne; vocals, guitar
+ Roy Wood; cello, guitar; 1970-72
+ Bev Bevan; drums; 1970-86
+ Richard Tandy; keyboards; 1972-
+ Kelly Groucutt; bass; 1974-83
+ Mik Kaminski; violin; 1973-79
~ Marc Bolan; 1; 1973; guitar on Ma-Ma-Ma Belle
~ George Harrison; 2; 2001; slide guitar on Zoom
~ Ringo Starr; 1; 2001; drums on Zoom

The Yardbirds | BEAT | London | 1963-1968 | 4
+ Keith Relf; vocals, harmonica
+ Jim McCarty; drums
+ Chris Dreja; guitar, bass
+ Paul Samwell-Smith; bass; 1963-66
+ Top Topham; guitar; 1963
+ Eric Clapton; guitar; 1963-65
+ Jeff Beck; guitar; 1965-66
+ Jimmy Page; bass, then guitar; 1966-68

Cream | BLUES | London | 1966-1968 | 4
+ Eric Clapton; guitar, vocals
+ Jack Bruce; bass, vocals
+ Ginger Baker; drums
~ Felix Pappalardi; 5; 1967; producer and extra instruments on Disraeli Gears and Wheels of Fire
~ George Harrison; 1; 1968; rhythm guitar on Badge

Blind Faith | BLUES | London | 1969-1969 | 1
+ Eric Clapton; guitar
+ Steve Winwood; vocals, keyboards
+ Ginger Baker; drums
+ Ric Grech; bass, violin

Delaney & Bonnie and Friends | BLUES | Los Angeles | 1967-1972 | 6
+ Delaney Bramlett; vocals, guitar
+ Bonnie Bramlett; vocals
+ Leon Russell; piano
+ Bobby Whitlock; keyboards, vocals; 1968-70
+ Carl Radle; bass; 1968-70
+ Jim Keltner; drums; 1968-69
+ Jim Gordon; drums; 1969-70
+ Bobby Keys; saxophone
+ Jim Price; trumpet
+ Eric Clapton; guitar; 1969-70
+ Dave Mason; guitar; 1969-70
~ George Harrison; 3; 1969; guitar on the December 1969 tour
~ Duane Allman; 3; 1970; slide guitar on To Bonnie from Delaney

Derek and the Dominos | BLUES | London | 1970-1971 | 1
+ Eric Clapton; guitar, vocals
+ Bobby Whitlock; keyboards, vocals
+ Carl Radle; bass
+ Jim Gordon; drums
~ Duane Allman; 5; 1970; slide guitar across the Layla album

The Allman Brothers Band | BLUES | Jacksonville | 1969-2014 | 11
+ Duane Allman; guitar; 1969-71
+ Gregg Allman; vocals, organ
+ Dickey Betts; guitar; 1969-2000
+ Berry Oakley; bass; 1969-72
+ Butch Trucks; drums
+ Jaimoe; drums

Eric Clapton (solo) | BLUES | London | 1970- | 21
+ Eric Clapton; vocals, guitar
+ Carl Radle; bass; 1974-79
+ Jamie Oldaker; drums; 1974-79
+ George Terry; guitar; 1974-78
+ Albert Lee; guitar; 1979-84
+ Chris Stainton; keyboards; 1979-
+ Henry Spinetti; drums; 1979-82
+ Dave Markee; bass; 1979-82
+ Gary Brooker; keyboards, vocals; 1979-81
+ Phil Collins; drums, producer; 1985-86
~ Delaney Bramlett; 5; 1970; produced and played on the first solo album
~ Leon Russell; 3; 1970; piano on the first solo album
~ Pete Townshend; 3; 1973; organised and played the Rainbow Concert
~ Ronnie Wood; 3; 1973; guitar at the Rainbow Concert
~ Steve Winwood; 3; 1973; keyboards at the Rainbow Concert
~ Ric Grech; 3; 1973; bass at the Rainbow Concert
~ Jim Capaldi; 3; 1973; drums at the Rainbow Concert

Joe Cocker and the Grease Band | BLUES | Sheffield | 1966-1971 | 2
+ Joe Cocker; vocals
+ Chris Stainton; keyboards, bass
+ Henry McCullough; guitar; 1968-70
+ Alan Spenner; bass; 1968-70
+ Bruce Rowland; drums; 1968-70
~ Jimmy Page; 5; 1968; guitar on five tracks of With a Little Help from My Friends
~ Steve Winwood; 2; 1968; organ on With a Little Help from My Friends
~ Albert Lee; 1; 1968; guitar on Marjorine
~ B.J. Wilson; 1; 1968; drums on the title track
~ Matthew Fisher; 1; 1968; organ on Just Like a Woman
~ Leon Russell; 5; 1970; bandleader of Mad Dogs & Englishmen
~ Jim Gordon; 5; 1970; drums on Mad Dogs & Englishmen
~ Jim Keltner; 5; 1970; drums on Mad Dogs & Englishmen
~ Carl Radle; 5; 1970; bass on Mad Dogs & Englishmen
~ Bobby Keys; 5; 1970; saxophone on Mad Dogs & Englishmen
~ Jim Price; 5; 1970; trumpet on Mad Dogs & Englishmen

Traffic | PSY | Birmingham | 1967-1974 | 8
+ Steve Winwood; vocals, keyboards, guitar
+ Jim Capaldi; drums, vocals
+ Chris Wood; flute, saxophone
+ Dave Mason; guitar, vocals; 1967-68, 1971
+ Ric Grech; bass; 1970-71
+ Jim Gordon; drums; 1971-72

Family | PROG | Leicester | 1966-1973 | 7
+ Roger Chapman; vocals
+ Charlie Whitney; guitar
+ Ric Grech; bass, violin; 1966-69
+ John Wetton; bass; 1971-72

Procol Harum | PSY | Southend | 1967- | 13
+ Gary Brooker; vocals, piano
+ Matthew Fisher; organ; 1967-69, 1991-2004
+ Robin Trower; guitar; 1967-71
+ B.J. Wilson; drums; 1967-77
+ Dave Knights; bass; 1967-69
+ Chris Copping; bass, organ; 1969-77
+ Mick Grabham; guitar; 1972-77

The Jimi Hendrix Experience | PSY | London | 1966-1970 | 3
+ Jimi Hendrix; guitar, vocals
+ Noel Redding; bass; 1966-69
+ Mitch Mitchell; drums
+ Billy Cox; bass; 1970
~ Chas Chandler; 5; 1967; producer of the first two albums
~ Steve Winwood; 1; 1968; organ on Voodoo Chile
~ Jack Casady; 1; 1968; bass on Voodoo Chile
~ Dave Mason; 2; 1968; twelve-string on All Along the Watchtower
~ Brian Jones; 1; 1968; percussion on All Along the Watchtower
~ Chris Wood; 1; 1968; flute on 1983
~ Buddy Miles; 2; 1968; drums on Rainy Day, Dream Away
~ Al Kooper; 1; 1968; piano on Long Hot Summer Night

Band of Gypsys | PSY | New York | 1969-1970 | 1
+ Jimi Hendrix; guitar, vocals
+ Billy Cox; bass
+ Buddy Miles; drums, vocals

Jefferson Airplane | PSY | San Francisco | 1965-1972 | 8
+ Grace Slick; vocals; 1966-72
+ Marty Balin; vocals
+ Paul Kantner; guitar, vocals
+ Jorma Kaukonen; guitar
+ Jack Casady; bass
+ Spencer Dryden; drums; 1966-70
~ Nicky Hopkins; 2; 1969; piano on Volunteers and at Woodstock

Vanilla Fudge | PSY | New York | 1967- | 8
+ Mark Stein; vocals, organ
+ Vince Martell; guitar
+ Tim Bogert; bass
+ Carmine Appice; drums

Cactus | HARD | New York | 1969-1972 | 4
+ Tim Bogert; bass
+ Carmine Appice; drums
+ Jim McCarty (Detroit); guitar
+ Rusty Day; vocals

Iron Butterfly | PSY | San Diego | 1966- | 6
+ Doug Ingle; organ, vocals
+ Ron Bushy; drums
+ Lee Dorman; bass; 1967-71
+ Erik Brann; guitar; 1967-69
+ Larry Reinhardt; guitar; 1969-71
+ Mike Pinera; guitar; 1969-72

Mountain | HARD | New York | 1969- | 8
+ Leslie West; guitar, vocals
+ Felix Pappalardi; bass, vocals; 1969-74
+ Corky Laing; drums
+ Steve Knight; keyboards; 1969-72

West, Bruce and Laing | HARD | New York | 1972-1974 | 2
+ Leslie West; guitar, vocals
+ Jack Bruce; bass, vocals
+ Corky Laing; drums

The Crazy World of Arthur Brown | PSY | London | 1967- | 1
+ Arthur Brown; vocals
+ Vincent Crane; organ; 1967-69
+ Drachen Theaker; drums; 1967-68
+ Carl Palmer; drums; 1968-69
~ Pete Townshend; 3; 1968; associate producer of the debut album

Pink Floyd | PSY | London | 1965-2014 | 15
+ Syd Barrett; guitar, vocals; 1965-68
+ Roger Waters; bass, vocals; 1965-85
+ Richard Wright; keyboards
+ Nick Mason; drums
+ David Gilmour; guitar, vocals; 1967-
+ Snowy White; touring guitar; 1977-80
~ Roy Harper; 1; 1975; lead vocal on Have a Cigar

Roy Harper (solo) | FOLK | Manchester | 1966- | 22
+ Roy Harper; vocals, guitar
~ Jimmy Page; 5; 1971; guitar on Stormcock and later albums, and the joint Whatever Happened to Jugula?
~ Keith Moon; 1; 1974; drums on Valentine
~ Ronnie Lane; 1; 1974; bass on Valentine
~ David Gilmour; 3; 1975; guitar on HQ
~ John Paul Jones; 1; 1975; bass on HQ
~ Bill Bruford; 3; 1975; drums on HQ
~ Paul McCartney; 1; 1977; backing vocals on One of Those Days in England

Hawkwind | PSY | London | 1969- | 35
+ Dave Brock; guitar, vocals
+ Nik Turner; saxophone, flute; 1969-76
+ Lemmy; bass, vocals; 1971-75
+ Simon King; drums; 1972-80
+ Robert Calvert; vocals; 1972-79
+ Huw Lloyd-Langton; guitar; 1969-71, 1979-88
+ Ginger Baker; drums; 1980-81

Motörhead | METAL | London | 1975-2015 | 22
+ Lemmy; bass, vocals
+ Larry Wallis; guitar; 1975-76
+ Eddie Clarke; guitar; 1976-82
+ Phil Taylor; drums; 1975-84, 1987-92
+ Brian Robertson; guitar; 1982-83
+ Phil Campbell; guitar; 1984-2015
+ Würzel; guitar; 1984-95
+ Mikkey Dee; drums; 1992-2015
~ Ozzy Osbourne; 1; 1992; duet on I Ain't No Nice Guy

Led Zeppelin | HARD | London | 1968-1980 | 8
+ Jimmy Page; guitar
+ Robert Plant; vocals
+ John Paul Jones; bass, keyboards
+ John Bonham; drums
~ Ian Stewart; 2; 1971; piano on Rock and Roll and Boogie with Stu
~ Sandy Denny; 1; 1971; duet on The Battle of Evermore
~ Phil Collins; 1; 1985; drums at the Live Aid reunion

Band of Joy | BLUES | Birmingham | 1966-1968 | 0
+ Robert Plant; vocals
+ John Bonham; drums; 1967-68
+ Kevyn Gammond; guitar

Robert Plant (solo) | HARD | West Bromwich | 1982- | 11
+ Robert Plant; vocals
+ Robbie Blunt; guitar; 1982-85
~ Phil Collins; 5; 1982; drums on Pictures at Eleven and The Principle of Moments
~ Cozy Powell; 2; 1982; drums on two tracks of Pictures at Eleven
~ Barriemore Barlow; 2; 1983; drums on two tracks of The Principle of Moments
~ Jimmy Page; 2; 1988; guitar on Now and Zen

The Honeydrippers | RR | London | 1981-1985 | 1
+ Robert Plant; vocals
~ Jimmy Page; 2; 1984; guitar on Volume One
~ Jeff Beck; 2; 1984; guitar on Volume One

The Firm | HARD | London | 1984-1986 | 2
+ Jimmy Page; guitar
+ Paul Rodgers; vocals
+ Tony Franklin; bass
+ Chris Slade; drums

Coverdale–Page | HARD | London | 1991-1993 | 1
+ David Coverdale; vocals
+ Jimmy Page; guitar
+ Denny Carmassi; drums

Page and Plant | HARD | London | 1994-1998 | 2
+ Jimmy Page; guitar
+ Robert Plant; vocals
+ Charlie Jones; bass
+ Michael Lee; drums

Donovan (solo) | FOLK | Glasgow | 1964- | 0
+ Donovan; vocals, guitar
~ John Paul Jones; 3; 1966; arranger and bassist on Sunshine Superman and Hurdy Gurdy Man
~ Jimmy Page; 2; 1966; session guitar on Sunshine Superman
~ Paul McCartney; 1; 1966; backing voice on Mellow Yellow

The Jeff Beck Group | HARD | London | 1967-1972 | 4
+ Jeff Beck; guitar
+ Rod Stewart; vocals; 1967-69
+ Ronnie Wood; bass; 1967-69
+ Micky Waller; drums; 1967-69
+ Aynsley Dunbar; drums; 1967
+ Nicky Hopkins; piano; 1968-69
+ Tony Newman; drums; 1969
+ Cozy Powell; drums; 1970-72
+ Bobby Tench; vocals, guitar; 1970-72
+ Max Middleton; keyboards; 1970-72
+ Clive Chaman; bass; 1970-72
~ Jimmy Page; 1; 1966; wrote and played twelve-string on Beck's Bolero
~ John Paul Jones; 3; 1968; bass on Beck's Bolero, organ elsewhere on Truth
~ Keith Moon; 2; 1966; drums on Beck's Bolero

Beck, Bogert & Appice | HARD | London | 1972-1974 | 1
+ Jeff Beck; guitar
+ Tim Bogert; bass, vocals
+ Carmine Appice; drums, vocals

Jeff Beck (solo) | HARD | London | 1975-2023 | 12
+ Jeff Beck; guitar
+ Max Middleton; keyboards; 1975-77
+ Jan Hammer; keyboards; 1976-
+ Simon Phillips; drums; 1979-81
+ Tony Hymas; keyboards; 1979-
+ Phil Chen; bass; 1975
+ Terry Bozzio; drums; 1989
~ Rod Stewart; 1; 1985; vocals on People Get Ready

Small Faces | BEAT | London | 1965-1978 | 5
+ Steve Marriott; vocals, guitar
+ Ronnie Lane; bass, vocals; 1965-69
+ Kenney Jones; drums
+ Ian McLagan; keyboards
+ Jimmy Winston; keyboards; 1965
+ Rick Wills; bass; 1977-78

Faces | HARD | London | 1969-1975 | 4
+ Rod Stewart; vocals
+ Ronnie Wood; guitar
+ Ronnie Lane; bass, vocals; 1969-73
+ Kenney Jones; drums
+ Ian McLagan; keyboards
+ Tetsu Yamauchi; bass; 1973-75

Humble Pie | HARD | London | 1969-1983 | 11
+ Steve Marriott; vocals, guitar
+ Peter Frampton; guitar, vocals; 1969-71
+ Greg Ridley; bass
+ Jerry Shirley; drums
+ Clem Clempson; guitar; 1971-75
+ Bobby Tench; guitar, vocals; 1980-81

Spooky Tooth | HARD | Carlisle | 1967-1974 | 7
+ Gary Wright; keyboards, vocals
+ Mike Harrison; vocals
+ Luther Grosvenor; guitar; 1967-70
+ Greg Ridley; bass; 1967-69
+ Mike Kellie; drums
+ Henry McCullough; guitar; 1970
+ Chris Stainton; keyboards; 1970
+ Alan Spenner; bass; 1970
+ Mick Jones; guitar; 1972-74

Foreigner | HARD | New York | 1976- | 9
+ Mick Jones; guitar
+ Lou Gramm; vocals
+ Ian McDonald; guitar, saxophone, keyboards; 1976-80
+ Dennis Elliott; drums; 1976-91
+ Al Greenwood; keyboards; 1976-80
+ Rick Wills; bass; 1979-92

Free | BLUES | London | 1968-1973 | 6
+ Paul Rodgers; vocals
+ Paul Kossoff; guitar
+ Andy Fraser; bass; 1968-72
+ Simon Kirke; drums
+ Tetsu Yamauchi; bass; 1972-73
+ John Bundrick; keyboards; 1972-73

Bad Company | HARD | London | 1973- | 12
+ Paul Rodgers; vocals
+ Mick Ralphs; guitar
+ Boz Burrell; bass; 1973-82
+ Simon Kirke; drums

Mott the Hoople | GLAM | Hereford | 1969-1974 | 7
+ Ian Hunter; vocals, piano
+ Mick Ralphs; guitar; 1969-73
+ Overend Watts; bass
+ Dale Griffin; drums
+ Verden Allen; organ; 1969-73
+ Luther Grosvenor; guitar; 1973-74
+ Mick Ronson; guitar; 1974
~ David Bowie; 2; 1972; wrote, produced and sang on All the Young Dudes

David Bowie (solo) | GLAM | London | 1964-2016 | 26
+ David Bowie; vocals
+ Mick Ronson; guitar; 1970-73
+ Woody Woodmansey; drums; 1970-73
+ Trevor Bolder; bass; 1971-73
+ Carlos Alomar; guitar; 1974-
+ Adrian Belew; guitar; 1978-79, 1990
~ Marc Bolan; 1; 1970; guitar on The Prettiest Star
~ Rick Wakeman; 5; 1971; Mellotron on Space Oddity, piano on Hunky Dory
~ John Lennon; 2; 1975; co-wrote and sang on Fame
~ Brian Eno; 5; 1977; collaborator on Low, "Heroes" and Lodger
~ Robert Fripp; 5; 1977; lead guitar on "Heroes" and Scary Monsters
~ Pete Townshend; 1; 1980; guitar on Because You're Young

T. Rex | GLAM | London | 1967-1977 | 12
+ Marc Bolan; vocals, guitar
+ Steve Peregrin Took; percussion; 1967-69
+ Mickey Finn; percussion; 1969-75
+ Steve Currie; bass; 1970-76
+ Bill Legend; drums; 1971-73
~ Rick Wakeman; 1; 1971; piano on Get It On

Roxy Music | GLAM | London | 1970-2011 | 8
+ Bryan Ferry; vocals
+ Brian Eno; synthesiser; 1971-73
+ Phil Manzanera; guitar
+ Andy Mackay; saxophone, oboe
+ Paul Thompson; drums
+ Eddie Jobson; keyboards, violin; 1973-76
+ John Wetton; touring bass; 1974-75

Queen | HARD | London | 1970- | 15
+ Freddie Mercury; vocals, piano; 1970-91
+ Brian May; guitar
+ Roger Taylor; drums
+ John Deacon; bass; 1971-97

Fairport Convention | FOLK | London | 1967- | 29
+ Simon Nicol; guitar
+ Richard Thompson; guitar; 1967-71
+ Ashley Hutchings; bass; 1967-69
+ Judy Dyble; vocals; 1967-68
+ Iain Matthews; vocals; 1967-69
+ Sandy Denny; vocals; 1968-69, 1974-75
+ Dave Swarbrick; fiddle; 1969-79
+ Dave Mattacks; drums; 1969-
+ Dave Pegg; bass; 1969-
+ Bruce Rowland; drums; 1975-79

Strawbs | FOLK | London | 1964- | 20
+ Dave Cousins; vocals, guitar
+ Sandy Denny; vocals; 1967
+ Rick Wakeman; keyboards; 1970-71
+ Richard Hudson; drums; 1970-73
+ John Ford; bass; 1970-73

Heads Hands & Feet | FOLK | London | 1969-1973 | 3
+ Albert Lee; guitar
+ Tony Colton; vocals
+ Ray Smith; guitar
+ Pete Gavin; drums
+ Chas Hodges; bass, fiddle
+ Mike O'Neill; keyboards; 1969-71

Chris Farlowe and the Thunderbirds | BEAT | London | 1959-1968 | 2
+ Chris Farlowe; vocals
+ Albert Lee; guitar; 1964-68
+ Dave Greenslade; organ
+ Carl Palmer; drums; 1966-67

Emmylou Harris and the Hot Band | FOLK | Los Angeles | 1975-1990 | 26
+ Emmylou Harris; vocals, guitar
+ James Burton; guitar; 1975-76
+ Glen D. Hardin; piano; 1975-78
+ Rodney Crowell; guitar, vocals; 1975-77
+ Emory Gordy Jr.; bass; 1975-77
+ Hank DeVito; pedal steel
+ John Ware; drums
+ Albert Lee; guitar; 1976-78
+ Ricky Skaggs; fiddle, mandolin; 1978-80

Green Bullfrog | HARD | London | 1970-1970 | 1
+ Ritchie Blackmore; guitar
+ Ian Paice; drums
+ Albert Lee; guitar
+ Big Jim Sullivan; guitar
+ Rod Alexander; guitar
+ Tony Ashton; keyboards
+ Matthew Fisher; keyboards
+ Chas Hodges; bass
+ Earl Jordan; vocals

The Artwoods | BEAT | London | 1963-1967 | 1
+ Art Wood; vocals
+ Jon Lord; organ
+ Keef Hartley; drums
+ Derek Griffiths; guitar
+ Malcolm Pool; bass

Episode Six | BEAT | London | 1964-1969 | 0
+ Ian Gillan; vocals; 1965-69
+ Roger Glover; bass
+ Mick Underwood; drums; 1968-69

Deep Purple | HARD | Hertford | 1968- | 23
+ Ritchie Blackmore; guitar; 1968-75, 1984-93
+ Jon Lord; organ; 1968-2002
+ Ian Paice; drums; 1968-
+ Rod Evans; vocals; 1968-69
+ Nick Simper; bass; 1968-69
+ Ian Gillan; vocals; 1969-73, 1984-89, 1992-
+ Roger Glover; bass; 1969-73, 1984-
+ David Coverdale; vocals; 1973-76
+ Glenn Hughes; bass, vocals; 1973-76
+ Tommy Bolin; guitar; 1975-76
+ Joe Lynn Turner; vocals; 1989-92
+ Steve Morse; guitar; 1994-2022
+ Don Airey; keyboards; 2002-
+ Simon McBride; guitar; 2022-

Jon Lord (solo) | PROG | London | 1971-2012 | 0
+ Jon Lord; keyboards
~ Albert Lee; 3; 1971; guitar soloist on Gemini Suite
~ Ian Paice; 3; 1971; drums on Gemini Suite
~ Roger Glover; 3; 1971; bass on Gemini Suite
~ Tony Ashton; 2; 1971; vocals on Gemini Suite
~ Cozy Powell; 2; 1982; drums on Before I Forget
~ Neil Murray; 2; 1982; bass on Before I Forget
~ Simon Kirke; 2; 1982; drums on Before I Forget
~ Boz Burrell; 2; 1982; bass on Before I Forget
~ Mick Ralphs; 1; 1982; guitar on Before I Forget

The Butterfly Ball (Roger Glover and Guests) | HARD | London | 1974-1975 | 1
+ Roger Glover; bass, producer
~ Ronnie James Dio; 3; 1974; lead vocal on Love Is All
~ David Coverdale; 1; 1974; lead vocal on Behind the Smile
~ Glenn Hughes; 1; 1974; lead vocal on Get Ready
~ Micky Moody; 3; 1974; guitar
~ Mickey Lee Soule; 2; 1974; vocals and keyboards
~ John Lawton; 2; 1974; vocals
~ Tony Ashton; 1; 1974; vocals

Captain Beyond | HARD | Los Angeles | 1971-1978 | 3
+ Rod Evans; vocals; 1971-73
+ Bobby Caldwell; drums
+ Larry Reinhardt; guitar
+ Lee Dorman; bass

James Gang | HARD | Cleveland | 1966-1977 | 9
+ Jim Fox; drums
+ Dale Peters; bass
+ Joe Walsh; guitar, vocals; 1968-71
+ Domenic Troiano; guitar; 1972-73
+ Tommy Bolin; guitar; 1973-74

Paice Ashton Lord | HARD | London | 1976-1978 | 1
+ Ian Paice; drums
+ Tony Ashton; vocals, keyboards
+ Jon Lord; keyboards
+ Bernie Marsden; guitar
+ Paul Martinez; bass

Elf | HARD | Cortland | 1967-1975 | 3
+ Ronnie James Dio; vocals, bass
+ David Feinstein; guitar; 1967-73
+ Gary Driscoll; drums
+ Mickey Lee Soule; keyboards
+ Craig Gruber; bass; 1973-75
~ Roger Glover; 3; 1974; produced all three albums

Rainbow | HARD | London | 1975-1984 | 8
+ Ritchie Blackmore; guitar
+ Ronnie James Dio; vocals; 1975-79
+ Craig Gruber; bass; 1975
+ Gary Driscoll; drums; 1975
+ Mickey Lee Soule; keyboards; 1975
+ Cozy Powell; drums; 1975-80
+ Jimmy Bain; bass; 1975-77
+ Tony Carey; keyboards; 1975-77
+ Mark Clarke; bass; 1977
+ Bob Daisley; bass; 1977-79
+ David Stone; keyboards; 1977-79
+ Roger Glover; bass, producer; 1979-84
+ Don Airey; keyboards; 1979-81
+ Graham Bonnet; vocals; 1979-80
+ Joe Lynn Turner; vocals; 1980-84
+ Bobby Rondinelli; drums; 1980-83

Trapeze | HARD | Cannock | 1969-1982 | 6
+ Glenn Hughes; bass, vocals; 1969-73
+ Mel Galley; guitar
+ Dave Holland; drums; 1969-79

Whitesnake | HARD | London | 1978- | 13
+ David Coverdale; vocals
+ Micky Moody; guitar; 1978-83
+ Bernie Marsden; guitar; 1978-82
+ Neil Murray; bass; 1978-82, 1984-86
+ Jon Lord; keyboards; 1978-84
+ Ian Paice; drums; 1979-82
+ Cozy Powell; drums; 1982-85
+ Mel Galley; guitar; 1982-84
+ John Sykes; guitar; 1983-86
+ Aynsley Dunbar; drums; 1985-87
+ Vivian Campbell; guitar; 1987-88
+ Rudy Sarzo; bass; 1987-94
+ Tommy Aldridge; drums; 1987-91, 2002-
+ Steve Vai; guitar; 1989-90
+ Denny Carmassi; drums; 1994-97
~ Don Airey; 5; 1987; keyboards on the 1987 album

Gillan | HARD | London | 1978-1982 | 6
+ Ian Gillan; vocals
+ John McCoy; bass
+ Colin Towns; keyboards
+ Bernie Tormé; guitar; 1979-81
+ Mick Underwood; drums; 1979-82
+ Janick Gers; guitar; 1981-82

Black Sabbath | METAL | Birmingham | 1968-2017 | 19
+ Tony Iommi; guitar
+ Ozzy Osbourne; vocals; 1968-79, 1997-2017
+ Geezer Butler; bass; 1968-84, 1990-94, 1997-2017
+ Bill Ward; drums; 1968-80, 1997-2012
+ Ronnie James Dio; vocals; 1979-82, 1991-92
+ Vinny Appice; drums; 1980-82, 1991-92
+ Ian Gillan; vocals; 1983-84
+ Bev Bevan; drums; 1983-84
+ Glenn Hughes; vocals; 1985-86
+ Eric Singer; drums; 1985-87
+ Tony Martin; vocals; 1987-91, 1993-97
+ Bob Daisley; bass; 1987
+ Cozy Powell; drums; 1988-91, 1994-95
+ Neil Murray; bass; 1989-91, 1994-95
+ Bobby Rondinelli; drums; 1993-94
~ Rick Wakeman; 1; 1973; keyboards on Sabbra Cadabra
~ Don Airey; 5; 1978; keyboards on Never Say Die!
~ Brian May; 1; 1989; guitar solo on When Death Calls

Ozzy Osbourne (solo) | METAL | Birmingham | 1979-2025 | 13
+ Ozzy Osbourne; vocals
+ Randy Rhoads; guitar; 1979-82
+ Bob Daisley; bass; 1979-81, 1983-85
+ Lee Kerslake; drums; 1979-81
+ Don Airey; keyboards; 1980-85
+ Tommy Aldridge; drums; 1981-85
+ Rudy Sarzo; bass; 1981-82
+ Bernie Tormé; guitar; 1982
+ Jake E. Lee; guitar; 1982-87
+ Carmine Appice; drums; 1983-84
+ Zakk Wylde; guitar; 1987-
+ Geezer Butler; bass; 1988-89, 1994-95
~ Lemmy; 4; 1991; co-wrote four songs on No More Tears
~ Tony Iommi; 2; 2022; guitar on Patient Number 9
~ Jeff Beck; 2; 2022; guitar on Patient Number 9
~ Eric Clapton; 1; 2022; guitar on Patient Number 9

Quiet Riot | METAL | Los Angeles | 1973- | 13
+ Kevin DuBrow; vocals
+ Randy Rhoads; guitar; 1973-79
+ Kelly Garni; bass; 1973-78
+ Rudy Sarzo; bass; 1978-79, 1982-85
+ Frankie Banali; drums; 1982-
+ Carlos Cavazo; guitar; 1982-

Dio | METAL | Los Angeles | 1982-2010 | 10
+ Ronnie James Dio; vocals
+ Vinny Appice; drums; 1982-89, 1993-98
+ Jimmy Bain; bass; 1982-89, 1999-2004
+ Vivian Campbell; guitar; 1982-86
+ Simon Wright; drums; 1990-91, 1998-2010
+ Rudy Sarzo; bass; 2004-10

Uriah Heep | HARD | London | 1969- | 25
+ Mick Box; guitar
+ David Byron; vocals; 1969-76
+ Ken Hensley; keyboards; 1970-80
+ Nigel Olsson; drums; 1970
+ Mark Clarke; bass; 1971-72
+ Lee Kerslake; drums; 1971-79, 1981-2007
+ Gary Thain; bass; 1972-75
+ John Wetton; bass; 1975-76
+ John Lawton; vocals; 1976-79
+ Trevor Bolder; bass; 1976-81, 1983-2013
+ Chris Slade; drums; 1979-81
+ Bob Daisley; bass; 1981-83

Judas Priest | METAL | Birmingham | 1969- | 19
+ Rob Halford; vocals
+ K.K. Downing; guitar; 1969-2011
+ Glenn Tipton; guitar; 1974-
+ Ian Hill; bass
+ Les Binks; drums; 1977-79
+ Dave Holland; drums; 1979-89
~ Simon Phillips; 5; 1977; session drums on Sin After Sin
~ Roger Glover; 3; 1977; produced Sin After Sin

Iron Maiden | METAL | London | 1975- | 17
+ Steve Harris; bass
+ Dave Murray; guitar
+ Paul Di'Anno; vocals; 1978-81
+ Dennis Stratton; guitar; 1979-80
+ Clive Burr; drums; 1979-82
+ Adrian Smith; guitar; 1980-90, 1999-
+ Bruce Dickinson; vocals; 1981-93, 1999-
+ Nicko McBrain; drums; 1982-
+ Janick Gers; guitar; 1990-

AC/DC | HARD | Sydney | 1973- | 17
+ Angus Young; lead guitar
+ Malcolm Young; rhythm guitar; 1973-2014
+ Bon Scott; vocals; 1974-80
+ Brian Johnson; vocals; 1980-
+ Phil Rudd; drums; 1975-83, 1994-2015
+ Mark Evans; bass; 1975-77
+ Cliff Williams; bass; 1977-
+ Simon Wright; drums; 1983-89
+ Chris Slade; drums; 1989-94, 2015-16

Thin Lizzy | HARD | Dublin | 1969-1983 | 12
+ Phil Lynott; bass, vocals
+ Brian Downey; drums
+ Eric Bell; guitar; 1969-73
+ Gary Moore; guitar; 1974, 1977, 1978-79
+ Scott Gorham; guitar; 1974-83
+ Brian Robertson; guitar; 1974-78
+ Snowy White; guitar; 1980-82
+ John Sykes; guitar; 1982-83

Colosseum | PROG | London | 1968-1971 | 3
+ Jon Hiseman; drums
+ Dick Heckstall-Smith; saxophone
+ Dave Greenslade; organ
+ Tony Reeves; bass; 1968-70
+ Clem Clempson; guitar; 1969-71
+ Mark Clarke; bass; 1970-71
+ Chris Farlowe; vocals; 1970-71

Colosseum II | PROG | London | 1975-1978 | 3
+ Jon Hiseman; drums
+ Gary Moore; guitar
+ Don Airey; keyboards
+ Neil Murray; bass; 1975-76
+ John Mole; bass; 1976-78

Atomic Rooster | PROG | London | 1969-1983 | 7
+ Vincent Crane; organ
+ Carl Palmer; drums; 1969-70
+ John Du Cann; guitar, vocals; 1970-71, 1980-82
+ Chris Farlowe; vocals; 1972-74

The Nice | PROG | London | 1967-1970 | 4
+ Keith Emerson; keyboards
+ Lee Jackson; bass, vocals
+ Brian Davison; drums
+ David O'List; guitar; 1967-68

Emerson, Lake & Palmer | PROG | London | 1970-1979 | 9
+ Keith Emerson; keyboards
+ Greg Lake; vocals, bass, guitar
+ Carl Palmer; drums

Emerson, Lake & Powell | PROG | London | 1985-1986 | 1
+ Keith Emerson; keyboards
+ Greg Lake; vocals, bass
+ Cozy Powell; drums

King Crimson | PROG | London | 1968- | 13
+ Robert Fripp; guitar
+ Greg Lake; vocals, bass; 1968-70
+ Ian McDonald; saxophone, keyboards; 1968-69
+ Michael Giles; drums; 1968-69
+ Mel Collins; saxophone; 1970-72, 2013-
+ Boz Burrell; vocals, bass; 1971-72
+ Ian Wallace; drums; 1971-72
+ John Wetton; bass, vocals; 1972-74
+ Bill Bruford; drums; 1972-97
+ David Cross; violin; 1972-74
+ Adrian Belew; guitar, vocals; 1981-2009
+ Tony Levin; bass, Chapman Stick; 1981-

Yes | PROG | London | 1968- | 23
+ Jon Anderson; vocals; 1968-80, 1983-2008
+ Chris Squire; bass; 1968-2015
+ Peter Banks; guitar; 1968-70
+ Tony Kaye; keyboards; 1968-71, 1983-94
+ Bill Bruford; drums; 1968-72
+ Steve Howe; guitar; 1970-81, 1995-
+ Rick Wakeman; keyboards; 1971-74, 1976-80
+ Alan White; drums; 1972-2022
+ Patrick Moraz; keyboards; 1974-76
+ Trevor Horn; vocals; 1980
+ Geoff Downes; keyboards; 1980, 2011-
+ Trevor Rabin; guitar, vocals; 1983-94

Genesis | PROG | Godalming | 1967-2022 | 15
+ Tony Banks; keyboards
+ Mike Rutherford; bass, guitar
+ Peter Gabriel; vocals; 1967-75
+ Anthony Phillips; guitar; 1967-70
+ Phil Collins; drums, vocals; 1970-96, 2006-22
+ Steve Hackett; guitar; 1971-77
+ Bill Bruford; touring drums; 1976
+ Chester Thompson; touring drums; 1977-2007

U.K. | PROG | London | 1977-1980 | 2
+ John Wetton; bass, vocals
+ Eddie Jobson; keyboards, violin
+ Bill Bruford; drums; 1977-78
+ Allan Holdsworth; guitar; 1977-78
+ Terry Bozzio; drums; 1978-80

Asia | PROG | London | 1981- | 13
+ John Wetton; bass, vocals
+ Steve Howe; guitar
+ Carl Palmer; drums
+ Geoff Downes; keyboards

Jethro Tull | PROG | Blackpool | 1967- | 23
+ Ian Anderson; vocals, flute
+ Mick Abrahams; guitar; 1967-68
+ Glenn Cornick; bass; 1967-70
+ Clive Bunker; drums; 1967-71
+ Tony Iommi; guitar; 1968
+ Martin Barre; guitar; 1968-2011
+ John Evan; keyboards; 1970-80
+ Jeffrey Hammond; bass; 1971-75
+ Barriemore Barlow; drums; 1971-80
+ Dave Pegg; bass; 1979-95
+ Eddie Jobson; keyboards, violin; 1980-81

Frank Zappa and the Mothers of Invention | PROG | Los Angeles | 1964-1993 | 62
+ Frank Zappa; guitar, vocals
+ Jimmy Carl Black; drums; 1964-69
+ Ian Underwood; keyboards, woodwinds; 1967-73
+ Aynsley Dunbar; drums; 1970-72
+ George Duke; keyboards; 1970-75
+ Chester Thompson; drums; 1973-74
+ Terry Bozzio; drums; 1975-78
+ Eddie Jobson; keyboards, violin; 1976-77
+ Adrian Belew; guitar, vocals; 1977-78
+ Steve Vai; guitar; 1980-82
~ Eric Clapton; 1; 1968; spoken part on We're Only in It for the Money
~ John Lennon; 2; 1971; jam at the Fillmore East
~ Jack Bruce; 1; 1974; bass on Apostrophe (')

Ten Years After | BLUES | Nottingham | 1966- | 10
+ Alvin Lee; guitar, vocals; 1966-2003
+ Leo Lyons; bass
+ Ric Lee; drums
+ Chick Churchill; keyboards

Taste | BLUES | Cork | 1966-1970 | 2
+ Rory Gallagher; guitar, vocals
+ Richard McCracken; bass
+ John Wilson; drums

Fleetwood Mac | BLUES | London | 1967- | 17
+ Mick Fleetwood; drums
+ John McVie; bass
+ Peter Green; guitar, vocals; 1967-70
+ Jeremy Spencer; guitar; 1967-71
+ Danny Kirwan; guitar; 1968-72
+ Christine McVie; keyboards, vocals; 1970-95, 2014-22
+ Bob Welch; guitar, vocals; 1971-74
+ Lindsey Buckingham; guitar, vocals; 1975-87, 1997-2018
+ Stevie Nicks; vocals; 1975-

Chicken Shack | BLUES | Birmingham | 1965- | 0
+ Stan Webb; guitar, vocals
+ Christine McVie; keyboards, vocals; 1967-69

UFO | HARD | London | 1968- | 22
+ Phil Mogg; vocals
+ Pete Way; bass; 1968-82
+ Andy Parker; drums
+ Michael Schenker; guitar; 1973-78
+ Paul Raymond; keyboards, guitar; 1976-80
+ Paul Chapman; guitar; 1978-83

Scorpions | HARD | Hanover | 1965- | 19
+ Rudolf Schenker; rhythm guitar
+ Klaus Meine; vocals; 1969-
+ Michael Schenker; guitar; 1970-73, 1979
+ Uli Jon Roth; guitar; 1973-78
+ Francis Buchholz; bass; 1973-92
+ Herman Rarebell; drums; 1977-95
+ Matthias Jabs; guitar; 1978-

Michael Schenker Group | HARD | London | 1979- | 0
+ Michael Schenker; guitar
+ Gary Barden; vocals; 1979-82
+ Cozy Powell; drums; 1980-82
+ Paul Raymond; keyboards, guitar; 1980-82
+ Chris Glen; bass; 1980-84
+ Graham Bonnet; vocals; 1982
~ Don Airey; 5; 1980; keyboards on the first album
~ Simon Phillips; 5; 1980; drums on the first album

The Doors | PSY | Los Angeles | 1965-1973 | 9
+ Jim Morrison; vocals; 1965-71
+ Ray Manzarek; keyboards
+ Robby Krieger; guitar
+ John Densmore; drums
~ Jerry Scheff; 5; 1971; bass on L.A. Woman

Steppenwolf | HARD | Los Angeles | 1967- | 13
+ John Kay; vocals, guitar
+ Goldy McJohn; organ; 1967-74
+ Jerry Edmonton; drums; 1967-76
+ Michael Monarch; guitar; 1967-69
+ Nick St. Nicholas; bass; 1968-70
+ Larry Byrom; guitar; 1969-71

Blue Cheer | HARD | San Francisco | 1967-2009 | 10
+ Dickie Peterson; bass, vocals
+ Leigh Stephens; guitar; 1967-68
+ Paul Whaley; drums

MC5 | HARD | Detroit | 1964-1972 | 3
+ Rob Tyner; vocals
+ Wayne Kramer; guitar
+ Fred Smith; guitar
+ Michael Davis; bass
+ Dennis Thompson; drums

The Stooges | HARD | Ann Arbor | 1967-2016 | 5
+ Iggy Pop; vocals
+ Ron Asheton; guitar, bass
+ Scott Asheton; drums
+ Dave Alexander; bass; 1967-70
+ James Williamson; guitar; 1970-74, 2009-16
~ David Bowie; 3; 1973; mixed Raw Power

Iggy Pop (solo) | GLAM | Ann Arbor | 1977- | 19
+ Iggy Pop; vocals
~ David Bowie; 5; 1977; co-wrote, produced and played on The Idiot and Lust for Life
~ Carlos Alomar; 5; 1977; guitar on The Idiot and Lust for Life

Grand Funk Railroad | HARD | Flint | 1969- | 13
+ Mark Farner; guitar, vocals
+ Don Brewer; drums, vocals
+ Mel Schacher; bass
+ Craig Frost; keyboards; 1972-76
~ Frank Zappa; 2; 1976; produced Good Singin', Good Playin' and played a guitar solo on it

ZZ Top | BLUES | Houston | 1969- | 15
+ Billy Gibbons; guitar, vocals
+ Dusty Hill; bass, vocals; 1969-2021
+ Frank Beard; drums

Lynyrd Skynyrd | BLUES | Jacksonville | 1964- | 14
+ Ronnie Van Zant; vocals; 1964-77
+ Gary Rossington; guitar; 1964-2023
+ Allen Collins; guitar; 1964-77
+ Leon Wilkeson; bass; 1972-2001
+ Billy Powell; keyboards; 1972-2009
+ Bob Burns; drums; 1964-74
+ Ed King; guitar; 1972-75, 1987-96
+ Artimus Pyle; drums; 1974-77, 1987-91
+ Steve Gaines; guitar; 1976-77
~ Al Kooper; 5; 1973; produced and played on the first three albums

Santana | PSY | San Francisco | 1966- | 26
+ Carlos Santana; guitar
+ Gregg Rolie; organ, vocals; 1966-71
+ David Brown; bass; 1966-71
+ Michael Shrieve; drums; 1969-74
+ Michael Carabello; percussion; 1968-71
+ Neal Schon; guitar; 1971-72

Journey | HARD | San Francisco | 1973- | 15
+ Neal Schon; guitar
+ Gregg Rolie; keyboards, vocals; 1973-80
+ Ross Valory; bass; 1973-85, 1995-2020
+ Aynsley Dunbar; drums; 1974-78
+ Steve Perry; vocals; 1977-98
+ Steve Smith; drums; 1978-85, 1995-98, 2015-20
+ Jonathan Cain; keyboards; 1980-

Jefferson Starship | POP | San Francisco | 1974- | 11
+ Paul Kantner; guitar, vocals; 1974-84
+ Grace Slick; vocals; 1974-78, 1981-84
+ Marty Balin; vocals; 1975-78
+ Craig Chaquico; guitar; 1974-84
+ Pete Sears; bass, keyboards; 1974-84
+ Aynsley Dunbar; drums; 1978-82

Eagles | FOLK | Los Angeles | 1971- | 7
+ Glenn Frey; vocals, guitar; 1971-2016
+ Don Henley; drums, vocals
+ Bernie Leadon; guitar, banjo; 1971-75
+ Randy Meisner; bass, vocals; 1971-77
+ Don Felder; guitar; 1974-2001
+ Joe Walsh; guitar, vocals; 1975-
+ Timothy B. Schmit; bass, vocals; 1977-

Alice Cooper | GLAM | Phoenix | 1964- | 29
+ Alice Cooper; vocals
+ Glen Buxton; guitar; 1964-74
+ Michael Bruce; guitar; 1964-74
+ Dennis Dunaway; bass; 1964-74
+ Neal Smith; drums; 1967-74
+ Dick Wagner; guitar; 1975-83
+ Steve Hunter; guitar; 1975-79
+ Eric Singer; touring drums; 1990-98
~ Donovan; 1; 1973; shared the vocal on Billion Dollar Babies

Aerosmith | HARD | Boston | 1970- | 15
+ Steven Tyler; vocals
+ Joe Perry; guitar; 1970-79, 1984-
+ Brad Whitford; guitar; 1971-81, 1984-
+ Tom Hamilton; bass
+ Joey Kramer; drums
+ Jimmy Crespo; guitar; 1979-84
~ Dick Wagner; 2; 1974; uncredited lead guitar on Get Your Wings
~ Steve Hunter; 1; 1974; uncredited lead guitar on Train Kept A-Rollin'

Kiss | HARD | New York | 1973-2023 | 20
+ Paul Stanley; vocals, guitar
+ Gene Simmons; bass, vocals
+ Ace Frehley; lead guitar; 1973-82, 1996-2002
+ Peter Criss; drums; 1973-80, 1996-2004
+ Eric Carr; drums; 1980-91
+ Vinnie Vincent; guitar; 1982-84
+ Bruce Kulick; guitar; 1984-96
+ Eric Singer; drums; 1991-96, 2001-23
+ Tommy Thayer; guitar; 2002-23
~ Dick Wagner; 2; 1976; uncredited guitar on Destroyer

Blue Öyster Cult | HARD | New York | 1967- | 15
+ Eric Bloom; vocals, guitar
+ Buck Dharma; lead guitar, vocals
+ Allen Lanier; keyboards, guitar; 1967-2007
+ Joe Bouchard; bass; 1970-86
+ Albert Bouchard; drums; 1967-81
+ Bobby Rondinelli; drums; 1997-2004

Montrose | HARD | San Francisco | 1973-1987 | 5
+ Ronnie Montrose; guitar
+ Sammy Hagar; vocals; 1973-75
+ Bill Church; bass; 1973-74
+ Denny Carmassi; drums; 1973-77

Van Halen | HARD | Pasadena | 1972-2020 | 12
+ Eddie Van Halen; guitar
+ Alex Van Halen; drums
+ David Lee Roth; vocals; 1974-85, 2007-20
+ Michael Anthony; bass; 1974-2006
+ Sammy Hagar; vocals; 1985-96, 2003-05
+ Gary Cherone; vocals; 1996-99

Hagar Schon Aaronson Shrieve | HARD | San Francisco | 1983-1984 | 1
+ Sammy Hagar; vocals
+ Neal Schon; guitar
+ Kenny Aaronson; bass
+ Michael Shrieve; drums

David Lee Roth (solo) | HARD | Los Angeles | 1985- | 6
+ David Lee Roth; vocals
+ Steve Vai; guitar; 1985-89
+ Billy Sheehan; bass; 1985-88
+ Gregg Bissonette; drums; 1985-92

Brian May and Friends | HARD | Los Angeles | 1983-1983 | 1
+ Brian May; guitar, vocals
+ Eddie Van Halen; guitar
+ Alan Gratzer; drums
+ Phil Chen; bass
+ Fred Mandel; keyboards

Heart | HARD | Seattle | 1973- | 16
+ Ann Wilson; vocals
+ Nancy Wilson; guitar, vocals; 1974-
+ Roger Fisher; guitar; 1973-79
+ Steve Fossen; bass; 1973-82
+ Howard Leese; guitar, keyboards; 1975-98
+ Michael DeRosier; drums; 1975-82
+ Denny Carmassi; drums; 1982-93

Rush | PROG | Toronto | 1968-2018 | 19
+ Geddy Lee; bass, vocals
+ Alex Lifeson; guitar
+ John Rutsey; drums; 1968-74
+ Neil Peart; drums; 1974-2015

* Queen × David Bowie (solo); Under Pressure single, 1981
* Donovan (solo) × The Jeff Beck Group; Barabajagal single, 1969
`;
export function parseRock() {
  const dash = s => s.replace(/-/g, "–"), artists = [], links = [], people = new Map(), bands = new Map(); let band = null;
  const person = (name, role) => { let p = people.get(name); if (!p) { p = { id: "m" + (people.size + 1), type: "musician", name, instrument: "" }; people.set(name, p); } if (role && !p.instrument) p.instrument = role.replace(/^touring /, ""); return p; };
  ROCK.split("\n").forEach(raw => {
    const line = raw.trim(); if (!line) return;
    if (line[0] === "+" || line[0] === "~") {
      const f = line.slice(1).split(";").map(s => s.trim());
      if (line[0] === "+") { const p = person(f[0], f[1]), l = { source: p.id, target: band.id, type: "member", role: f[1] }; if (f[2]) { l.years = dash(f[2]); l.from = +f[2].slice(0, 4); } links.push(l); }
      else { const p = person(f[0]); links.push({ source: p.id, target: band.id, type: "guest", weight: +f[1] || 1, year: +f[2] || null, note: f[3] || "" }); }
    } else if (line[0] === "*") { const f = line.slice(1).split(";"), ab = f[0].split("×").map(s => bands.get(s.trim())); links.push({ source: ab[0].id, target: ab[1].id, type: "collab", kind: f[1].trim() }); }
    else { const f = line.split("|").map(s => s.trim()), y = f[3].split("-"); band = { id: "b" + (bands.size + 1), type: "band", name: f[0], genre: ROCK_GENRES[f[1]][0], city: f[2], formed: +y[0], ended: +y[1] || null, albums: +f[4] || 0 }; bands.set(f[0], band); artists.push(band); }
  });
  people.forEach(p => artists.push(p));
  return { meta: { title: "Early rock and metal", real: true, defaults: { sizeBy: "albums" }, genres: Object.values(ROCK_GENRES).map(g => ({ name: g[0], color: g[1] })),
    note: "Hand-compiled line-ups and guest spots. Album counts are studio albums and approximate. No streaming numbers." }, artists, links };
}

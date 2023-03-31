import random

finalList = ""

apiariesNum = int(input('Number of Apiaries: '))
apiariesPrefix = "ISD-lab-Syros" #input('Apiaries prefix: ')



for i in range(apiariesNum):
    lat = 37.427481
    lon = 24.913192
    lat += random.uniform(-0.01 , 0.01)
    lon += random.uniform(-0.01 , 0.01)
    
    apiaryName = apiariesPrefix +'-' + str(i+1).zfill(3)
    hivesNum = int(input('Number of Hives in ' + apiaryName +': '))
    alert = random.choice(["true", "false"])

    finalList += '{ name: "' + apiaryName + '",\n'
    finalList += '  alert: '+ alert + ',\n'
    finalList += '  hives: [\n' 
    for j in range(hivesNum):
        finalList += '      { name: "hive_' + str(j).zfill(2) +'",\n'
        lat += random.uniform(-0.005 , 0.005)
        lon += random.uniform(-0.005 , 0.005)        
        finalList += '          coordinates: [' + str(round(lat,6)) + ','+ str(round(lon,6)) +'],'
        finalList += '},\n'
    finalList += '  ],\n'
    finalList += '},\n'
        
print('\n\n' + 'export const apiariesHardcoded = [\n' + finalList + ']')

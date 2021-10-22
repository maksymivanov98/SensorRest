@RestResource(urlMapping='/Sensors/*')
global class SensorRestServices {
@HttpPost
    global static Sensor__c createSensor(String str){             
        ModelSensor ms = (ModelSensor)JSON.deserialize(str, ModelSensor.class);
        Sensor__c sensor;
        List<Sensor_Event__c> sensorVectors= new List <Sensor_Event__c>();
        List<Sensor__c> sensorscount = [SELECT 
                                        id,
                                        Name
                                        FROM Sensor__c WHERE Name =: ms.sensorid];
        if(sensorscount.size()==0){
            Sensor__c sensorNew = new Sensor__c(Name = ms.sensorid);
            insert sensorNew;
            sensor = sensorNew;
            for(integer i = 0;i<ms.vectors.size();i++){
            Sensor_Event__c vectors  = new Sensor_Event__c(Sensor__c = sensorNew.Id, X__c = ms.vectors[i].X,Y__c =ms.vectors[i].Y ,Z__c = ms.vectors[i].Z);
            sensorVectors.add(vectors);
            }
        insert sensorVectors;
        }else{
            sensor = sensorscount.get(0);
            List<Sensor_Event__c> sensorEvents= [SELECT 
                                                 id, 
                                                 X__c, 
                                                 Y__c, 
                                                 Z__c 
                                                 FROM Sensor_Event__c WHERE Sensor__c =: sensorscount.get(0).Id];
            for(integer i = 0;i<ms.vectors.size();i++){
                for(integer m = 0;m<sensorEvents.size();m++){
                   if(sensorEvents.get(m).X__c == ms.vectors.get(i).x && sensorEvents.get(m).Y__c == ms.vectors.get(i).y && sensorEvents.get(m).Z__c == ms.vectors.get(i).z){
                        break;
                   } else if(m == sensorEvents.size()-1 && sensorEvents.get(m).X__c != ms.vectors.get(i).x){
                       Sensor_Event__c event = new Sensor_Event__c(X__c = ms.vectors.get(i).x, Y__c = ms.vectors.get(i).y, Z__c = ms.vectors.get(i).z, Sensor__c = sensorscount.get(0).id);
                       sensorVectors.add(event);
                   }
                }
            }
            insert sensorVectors;
        }
        return sensor;
    }
}
const { default: mongoose } = require('mongoose');

const packageModel = require('../../models/Package');
const famMembersModel = require('../../models/LinkedFamily');
const depFamMemberModel = require('../../models/Family');
const subsPackageModel =  require('../../models/SubscribedPackages');
const patientModel =  require('../../models/Patient');



//to get all packages details
const ViewPackage = async (req, res) => {
    const package = await packageModel.find({valid : "valid"});
    res.status(200).json(package)
 }

//to get all linked members to certain patient
 const ViewLinkedFam = async (req, res) => {
    const patient_username=req.body.username;
    const members = await famMembersModel.find({ patient_username: patient_username });
    res.status(200).json(members)
 }

 //to get all dependant members to certain patient
 const ViewDepFam = async (req, res) => {
  const patient_username=req.body.username;
  const members = await depFamMemberModel.find({ patient_username: patient_username });
  res.status(200).json(members)
}


 

//to subscribe to a package
 const Subscribe = async (req, res) => {

    const patient_username=req.body.patient_username;
    const package_name=req.body.package_name;
    const isExistingPatient=req.body.exist;
    var patient_name="";
    console.log(req.body);


    //check if already subscribed
    const isSubs = await subsPackageModel.findOne({patient_username : patient_username , status:'subscribed'});
    

    try{

        if (!isSubs){

            //add to subspackage schema 
            const start_date= new Date();
            const end_date = new Date(start_date);
            end_date.setFullYear(end_date.getFullYear() + 1);

            if (isExistingPatient==='true'){
               const patient = await patientModel.findOne({username:patient_username});
               patient_name=patient.name;
            }
            else {
              const fam = await depFamMemberModel.findOne({national_id:patient_username});
              patient_name=fam.name;
            }

            
            const subspackage = await subsPackageModel.create({patient_username,patient_name,package_name,status:'subscribed',start_date,end_date});
            
            //add to array in packages schema
            const package=await packageModel.findOne({name:package_name , valid : "valid"});
            package.subscribed_patients.push(patient_username);
            package.save();

            //add to patient schema 
            if (isExistingPatient=='true'){
            const updatedPatient = await patientModel.updateOne({username:patient_username},{subscribed_package:package_name});
            }

            //get price of subscription
            const package2=await packageModel.findOne({name:package_name , valid : "valid"});
            const discount= await isMemberSubscribed(patient_username);
            //console.log(discount);

            var price =package2.price-(package2.price*(discount/100));

            const packObject = subspackage.toObject();
            packObject.priceBefore=package2.price;
            packObject.priceAfter=price;
            // console.log(packObject);
            // console.log(priceAttributes);
            res.status(200).json(packObject);
        }
        else{
          res.status(409).json({ message: 'Already Subscribed to a Package' });
        }
      }
      catch(error){
        
            res.status(400).json({error:error.message})
        }
      
      
 }


 const Subscribe1 = async (req, res) => {

    const patient_username=req.body.patient_username;
    const package_name=req.body.package_name;
    const isExistingPatient=req.body.exist;

    console.log(patient_username);

    //check if already subscribed
    const isSubs = await subsPackageModel.findOne({patient_username : patient_username , status:'subscribed'});
    var discount=0;
    try{

        if (!isSubs){

            //get price of subscription
            const package2=await packageModel.findOne({name:package_name , valid : "valid"});
            console.log(package2)

            if (isExistingPatient=='true'){
              discount= await isMemberSubscribed(patient_username);
            }
            else {
              discount= await isMemberSubscribedDep(patient_username);
            }

            var price =package2.price-(package2.price*(discount/100));

            const packObject = {
              /*the returned username of the subs one but i need to change it in the 
              front end to the paying one for logy*/
                patient_username:patient_username,
                paying_username:"",
                package_name:package_name,
                priceBefore:package2.price,
                priceAfter:price,
                isExistingPatient:isExistingPatient
            };
           
            res.status(200).json(packObject);
        }
        else{
          res.status(409).json({ message: 'Already Subscribed To a Package' });
        }
      }
      catch(error){
        
            res.status(400).json({error:error.message})
        }
      
      
 }

 const Subscribe2 = async (req, res) => {

    const patient_username=req.body.patient_username;
    const package_name=req.body.package_name;
    const isExistingPatient=req.body.isExistingPatient;
    


    try{
      var patient_name="";

            //add to subspackage schema 
            const start_date= new Date();
            const end_date = new Date(start_date);
            end_date.setFullYear(end_date.getFullYear() + 1);

            //get name of the patient 
            if (isExistingPatient==='true'){
              const patient = await patientModel.findOne({username:patient_username});
              patient_name=patient.name;
           }
           else {
             const fam = await depFamMemberModel.findOne({national_id:patient_username});
             patient_name=fam.name;
           }

            const subspackage = await subsPackageModel.create({patient_username,patient_name,package_name,status:'subscribed',start_date,end_date});
            
            //add to array in packages schema
            const package=await packageModel.findOne({name:package_name , valid : "valid"});
            package.subscribed_patients.push(patient_username);
            package.save();

            //add to patient schema 
            if (isExistingPatient=='true'){
              const updatedPatient = await patientModel.updateOne({username:patient_username},{subscribed_package:package_name});
            }

            res.status(200).json(subspackage);
        }

      catch(error){
          res.status(400).json({error:error.message})
        }
      
      
 }

 //to unsubscribe to a package
 const Unsubscribe = async (req, res) => {

    const patient_username=req.body.patient_username;
    const package_name=req.body.package_name;
    const subs_id=req.body.id;

    console.log(patient_username);
    console.log(package_name);
    console.log(subs_id);

    //check if already subscribed
    //const isSubs = await subsPackageModel.findOne({patient_username : patient_username});
    

    try{

    
            //update in  subspackage schema 
            
           // const end_date = new Date();
            const status = 'cancelled';
            //const update={end_date,status};
            const update={status};
           // const updatedsubs = await subsPackageModel.updateOne({patient_username,package_name},{end_date,status});
            const updatedsubs = await subsPackageModel.findByIdAndUpdate(subs_id, update, { new: true });
            
            //remove from array in packages schema
            const package=await packageModel.findOne({name:package_name});
            package.subscribed_patients.pop(patient_username);
            package.save();

            //update to null in patient schema 
            const updatedPatient = await patientModel.updateOne({username:patient_username},{subscribed_package:null});

           
            res.status(200).json(updatedsubs);
        
        
      }
      catch(error){
            res.status(400).json({error:error.message})
        }
      
      
    }


    const Famsubs = async (req, res) => {
      const patient_username = req.body.username;
  
      // Get family members of this patient and extract their username and name
      const members = await famMembersModel.find({ patient_username });
      const family_usernames1 = members.map((doc) => ({ username: doc.username, name: doc.name }));
  
      // Get family members dependent
      const Depmembers = await depFamMemberModel.find({ patient_username });
      const family_usernames2 = Depmembers.map((doc) => ({ username: doc.national_id, name: doc.name }));
  
      // Get name of patient and include it in the array of users
      const orgpatient = await patientModel.findOne({ username: patient_username });
      family_usernames1.push({ username: patient_username, name: orgpatient.name });
  
      // Combine both sets of family usernames
      const allFamilyUsernames = [...family_usernames1, ...family_usernames2];
     console.log(allFamilyUsernames);
      // Fetch subscribed packages for each family member
      const Allsubs = [];
  
      for (const user of allFamilyUsernames) {
          const mostRecentRecord = await subsPackageModel.find(
              { patient_username: user.username })
               .sort({ start_date: -1 })
            
             
             
         // console.log(mostRecentRecord);
          if (mostRecentRecord.length>0) {
              Allsubs.push(mostRecentRecord[0]);
          }
           else {
              // If there is no record for a particular user, create a default record
              const defaultRecord = {
                  patient_username: user.username,
                  patient_name: user.name,
                  package_name: 'No Package',
                  status: 'unsubscribed',
                  start_date: new Date('0000-00-00'),
                  end_date: new Date('0000-00-00')
              };
              Allsubs.push(defaultRecord);
          }
      }
  
      console.log(Allsubs);
      res.status(200).json(Allsubs);
  };
  


 //get row of subscribedpackages schema of linked family and user
//  const Famsubs = async (req, res) => {
//     const patient_username=req.body.username;

//     //get family members of this patient and extract their username and name
//     const members = await famMembersModel.find({ patient_username});
//     var family_usernames1 = members.map((doc) => ({ username: doc.username, name: doc.name }));

//     //get family members dependant 
//     const Depmembers = await depFamMemberModel.find({ patient_username});
//     var family_usernames2 = Depmembers.map((doc) => ({ username: doc.national_id, name: doc.name }));

    


//     //get name of patient and inclde it n the array of users
//     const orgpatient = await patientModel.findOne({ username:patient_username});
//     family_usernames1.push({username:patient_username,name:orgpatient.name});

//     //const family_usernames=family_usernames1+family_usernames2;
//     //console.log(family_usernames);
    
//     const Allsubs=[];

    
//     for (const item of family_usernames1) {
       
//         const IsSubs = await subsPackageModel.find({patient_username:item.username});
       
//         if (IsSubs && IsSubs.length>0) {
//             Allsubs.push(...IsSubs);    
//         } 
//         else {
//         const object = {
//           patient_username: item.username,
//           patient_name : item.name ,
//           package_name : 'No Package',
//           status : 'unsubscribed',
//           start_date : new Date('0000-00-00'),
//           end_date : new Date('0000-00-00') 
//         };
//         Allsubs.push(object);   
//         }
//         console.log(Allsubs);
        
//    }
      
//    for (const item of family_usernames2) {
       
//     const IsSubs = await subsPackageModel.find({patient_username:item.username});
   
//     if (IsSubs && IsSubs.length>0) {
//         Allsubs.push(...IsSubs);    
//     } 
//     else {
//     const object = {
//       patient_username: item.username,
//       patient_name : item.name ,
//       package_name : 'No Package',
//       status : 'unsubscribed',
//       start_date : new Date('0000-00-00'),
//       end_date : new Date('0000-00-00') 
//     };
//     Allsubs.push(object);   
//     }
    
// }



   
//     res.status(200).json(Allsubs);
    
//  }






 //helpers

 //check if a certain user has a linked family member that has is subs to a package 
 const isMemberSubscribed = async (patient_username) => {
    const members = await famMembersModel.find({ username: patient_username});
    var maxdiscount=0;
    console.log(members);
    for (const member of members) {
       
        const username=member.patient_username;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

        const isSubs = await subsPackageModel
        .find({
              patient_username: username,
              status: { $in: ['subscribed', 'cancelled'] },
              end_date: { $gte: today } })
        .sort({ start_date: -1 })
        .limit(1);

        console.log("hisalma");
        console.log(isSubs);
        //const isSubs = await subsPackageModel.findOne({patient_username : username , status:'subscribed'});
        
        if (isSubs.length>0){
            const package_name=isSubs[0].package_name;
            const package =  await packageModel.findOne({name:package_name});
            console.log(package);

            if (package.family_discount>maxdiscount){
                maxdiscount=package.family_discount;
            }
        }

    }
    console.log(maxdiscount);
    return maxdiscount;
  };

  //check if a certain user has a linked family member that has is subs to a package 
 const isMemberSubscribedDep = async (patient_username) => {
  const members = await depFamMemberModel.find({ national_id: patient_username});
  var maxdiscount=0;
  console.log(members);
  for (const member of members) {
     
      const username=member.patient_username;

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

      const isSubs = await subsPackageModel
      .find({
            patient_username: username,
            status: { $in: ['subscribed', 'cancelled'] },
            end_date: { $gte: today } })
      .sort({ start_date: -1 })
      .limit(1);

      console.log("hisalma");
      console.log(isSubs);
      //const isSubs = await subsPackageModel.findOne({patient_username : username , status:'subscribed'});
      
      if (isSubs.length>0){
          const package_name=isSubs[0].package_name;
          const package =  await packageModel.findOne({name:package_name});

          if (package.family_discount>maxdiscount){
              maxdiscount=package.family_discount;
          }
      }

  }
  console.log(maxdiscount);
  return maxdiscount;
};


//get all patients
  const Allpatients = async (req, res) => {
    const patients = await patientModel.find();
    res.status(200).json(patients)
 }

 //get all row of subscribedpackages schema
 const Allsubs = async (req, res) => {
    const subs = await subsPackageModel.find();
    res.status(200).json(subs)
 }






module.exports = {ViewPackage,ViewLinkedFam,ViewDepFam,Subscribe,Unsubscribe,Famsubs,Allpatients,Allsubs,Subscribe1,Subscribe2};
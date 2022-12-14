import { useState, useEffect, useRef } from "react";
import Input from "../components/NewAnnouncement/Input";
import Picture from "../components/NewAnnouncement/Picture";
import MobileNewAnnouncement from "../components/NewAnnouncement/MobileNewAnnouncement";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";

const NewAnnouncement = () => {
  const [brandValue, setBrandValue] = useState(null);
  const [modelValue, setModelValue] = useState(null);
  const [extraBoolen,setExtraBoolen]=useState([])

  const [values, setValues] = useState({
    gearValue: null,
    fuelValue: null,
    categoryValue: null,
    yearValue: null,
    colorValue: null,
    transmissionValue: null,
    mileageValue: null,
    engineVolumeValue: null,
    enginePowerValue: null,
    priorOwnerCountValue: null,
    marketValue: null,
    cityValue: null,
    seatsCountValue: null,
    priceValue: null,
    priceTypeValue:1,
    mileageTypeValue:1,
    phoneNumberValue:null,
    descriptionValue: null,
    crashedValue: null,
    paintedValue: null,
    loanValue: null,
  });
  const selectedImages = useSelector((state) => state.selectedImages.value);
  
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  
  const [data, setData] = useState({
    fuels: null,
    gears: null,
    category: null,
    transmission: null,
    year: null,
    color: null,
    engineVolume: null,
    priorOwnerCount: null,
    market: null,
    city: null,
    seatsCount: null,
    priceType: null,
    mileageType: null,
    extraBooleanFields: [],
  });
  const getBrands = async (id) => {
    const url = `/api/post/choices/`;
    const { data } = await axios.get(url);
    setBrands(data.brand.map((n) => ({ value: n.id, label: n.name })));
    setData({
      fuels: data.fuel_type.map((n) => ({ value: n.id, label: n.name })),
      gears: data.gear.map((n) => ({ value: n.id, label: n.name })),
      category: data.category.map((n) => ({ value: n.id, label: n.name })),
      transmission: data.transmission.map((n) => ({value: n.id, label: n.name,})),
      year: data.year.map((n) => ({ value: n.id, label: n.year })),
      color: data.color.map((n) => ({ value: n.id, label: n.name })),
      engineVolume: data.engine_volume.map((n) => ({value: n.id, label: n.volume,})),
      priorOwnerCount: data.prior_owners_count.map((n) => ({value: n.id, label: n.name,})),
      market: data.market.map((n) => ({ value: n.id, label: n.name })),
      city: data.city.map((n) => ({ value: n.id, label: n.name })),
      seatsCount: data.seats_count.map((n) => ({value: n.id, label: n.count,})),
      extraBooleanFields: data.extra_boolean_fields.map((n) => n.name),
      priceType: data.price_type.map((n) => n.name),
      mileageType: data.mileage_type.map((n) => n.name),
    });

    // when the brand is selected, get the models
    if (brandValue !== null) {
      const models = `/api/post/models-choices/?brand=${id}`;
      const modelsData = await axios.get(models);
      setModels(modelsData.data.map((n) => ({ value: n.id, label: n.name })));
    }
  };
  useEffect(() => {
    setModelValue(null);
  }, [brandValue]);
  useEffect(() => {
    let id = brands.indexOf(brandValue) + 1;
    getBrands(id);
  }, [brandValue]);

  //------------------------------------------------------------ 
  const handleChange = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    console.log("target",e.target)
    // Case 1 : The user checks the box
  
    if (checked) {
      setExtraBoolen([...extraBoolen,value]);
    }
  
    // Case 2  : The user unchecks the box
    else {
      setExtraBoolen(extraBoolen.filter((e) => e !== value));
    }
  };
  //------------------------------------------------------------ 
  console.log(extraBoolen)
  const files = useSelector((state) => state.file.value);
  console.log("files: " + files)
  var filesArray = Object.keys(files).map(function (key) {
    return files[key];
  });
  let formData = new FormData();
  for (var key in filesArray) {
    formData.append("uploaded_images", filesArray[key]);
  }
  formData.append("mileage", values?.mileageValue);
  formData.append("price", values.priceValue);
  for (let i = 0; i < extraBoolen?.length; i++) {

    formData.append("extra_fields", extraBoolen[i]);
    console.log("value : ",extraBoolen[i]);
  }
  formData.append("crashed", values?.loanValue);
  formData.append("loan", values?.loanValue);
  formData.append("painted",values?.loanValue);
  formData.append("description", values.descriptionValue);
  formData.append("brand", brandValue?.value);
  formData.append("auto_model", modelValue?.value);
  formData.append("phone_number", values?.phoneNumberValue);
  formData.append("category", values?.categoryValue?.value);
  formData.append("mileage_type", values.mileageTypeValue);
  formData.append("color", values?.colorValue?.value);
  formData.append("price_type",values?.priceTypeValue);
  formData.append("prior_owners_count", values?.priorOwnerCountValue?.value);
  formData.append("seats_count", values?.seatsCountValue?.value);
  formData.append("fuel_type", values?.fuelValue?.value);
  formData.append("gear", values?.gearValue?.value);
  formData.append("transmission", values?.transmissionValue?.value);
  formData.append("year", values?.yearValue?.value);
  formData.append("engine_volume", values?.engineVolumeValue?.value);
  formData.append("engine_power", values?.enginePowerValue);
  formData.append("market", values?.marketValue?.value);
  formData.append("city", values?.cityValue?.value);

  const token = useSelector((state)=>state.auth.value)
  const postCarData =async (e) => {
    e.preventDefault();
    const url = `/api/post/create/`;
    const post = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "multipart/form-data",
      },
    });
  };
  //---------------------------------------------------------------------------------------------
  const [inputValue,setInputValue]=useState('')
  const handleInput=e=>{
      const formattedPhoneNumber=formatPhoneNumber(e.target.value)
      setInputValue(formattedPhoneNumber)
      setValues({...values,phoneNumberValue:e.target.value.replace(/[^\d]/gm,'')})
}

function formatPhoneNumber(value) {
  if(!value) return value;
  const phoneNumber=value.replace(/[^\d]/gm,'')
  const phoneNumberLength = phoneNumber.length
  if(phoneNumberLength<4) return phoneNumber
  if(phoneNumberLength<7){
      return `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3)}`
  }
  return `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3,6,)}-${phoneNumber.slice(6,10)}`
}
  //---------------------------------------------------------------------------------------------- 
  return (
    <>
      <MobileNewAnnouncement />
      <div
        className='hidden lg:flex flex-col min-h-screen w-full sm:w-[540px] pt-6 pl-6 pr-6 mx-auto
    bg-white dark:bg-[#1c1c1e] text-black dark:text-white lg:min-w-[960px]'
      >
        <div className=''>Yeni elan yerl????dirin</div>
        <form
          onSubmit={postCarData}
          className=' flex w-full justify-between flex-wrap'
        >
          <Input
            name={"Marka :"}
            options={brands}
            placeholder={"Marka"}
            value={brandValue}
            onChange={setBrandValue}
          />
          <Input
            name={"Model : "}
            options={models}
            placeholder={"Model"}
            value={modelValue}
            isDisabled={brandValue === null}
            onChange={setModelValue}
          />
          <Input
            name={"Yanacaq n??v?? : "}
            options={data.fuels}
            value={values.fuelValue}
            onChange={(e) => setValues({...values, fuelValue: e })}
            placeholder={"Yanacaq n??v??"}
          />
          <Input
            name={"??t??r??c?? : "}
            options={data.gears}
            value={values.gearValue}
            onChange={(e) => setValues({...values, gearValue: e })}
            placeholder={"??t??r??c??"}
          />
          <Input
            name={"Ban n??v?? : "}
            options={data.category}
            value={values.categoryValue}
            onChange={(e) => setValues({...values, categoryValue: e })}
            placeholder={"Ban n??v??"}
          />
          <Input
            name={"S??r??tl??r qutusu : "}
            options={data.transmission}
            value={values.transmissionValue}
            onChange={(e) => setValues({...values, transmissionValue: e })}
            placeholder={"S??r??tl??r qutusu"}
          />

          {/* MILEAGE */}
          <div className=' pt-2 pb-2 w-[48%] rounded flex items-center justify-between'>
            <div className='mr-5'>Y??r???? :</div>

            <div className='w-[250px] flex items-center'>
              <input
                value={values.mileageValue}
                onChange={(e) => setValues({...values, mileageValue: e.target.value })}
                type='number'
                placeholder='0'
                min='0'
                step='10000'
                className='max-w-[110px] px-2 bg-white text-black border-gray-400 border rounded flex items-center min-h-[38px] outline-none'
              />
              {data?.mileageType?.map((item, index) => {
                return (
                  <div key={index} className='w-[50px] flex ml-3'>
                    <input  type='radio' defaultChecked={index === 0} value={index+1} onChange={(e) => setValues({...values,mileageTypeValue:e.target.value})}
                      name='mileage' id={`${item}`} className=''/>{" "}
                    <label name='mileage' htmlFor={`${item}`} className='ml-1'>{item}</label>
                  </div>
                );
              })}
            </div>
          </div>
          {/* -------------------- */}
          <Input
            name={"??l : "}
            options={data.year}
            value={values.yearValue}
            onChange={(e)=>setValues({...values,yearValue: e})}
            placeholder={"??l"}
          />
          <Input 
          name={"R??ng : "} 
          options={data.color} 
          value={values.colorValue}
          onChange={(e)=>setValues({...values,colorValue: e})} 
          placeholder={"R??ng"} />
          <Input
            name={"M??h??rrikin h??cmi,sm"}
            sup={"3"}
            options={data.engineVolume}
            value={values.engineVolumeValue}
            onChange={(e)=>setValues({...values,engineVolumeValue: e})}
            placeholder={"M??h??rrikin h??cmi,sm"}
          />
          {/* PRICE */}
          <div className=' pt-2 pb-2 w-[48%] rounded flex items-center justify-between'>
            <div className='mr-5'>Qiym??t :</div>

            <div className='w-[250px] flex items-center'>
              <input
                value={values?.priceValue}
                onChange={(e) => setValues({...values, priceValue: e.target.value })}
                type='number'
                placeholder='0'
                min='0'
                step='500'
                className='max-w-[110px] px-2 bg-white text-black border-gray-400 border rounded flex items-center min-h-[38px] outline-none'
              />

              {data?.priceType?.map((item, index) => {
                return (
                  <div key={index} className='w-[200px] flex'>
                    <input  type='radio' defaultChecked={index === 0} value={index+1} onChange={(e) => setValues({...values,priceTypeValue:e.target.value})}
                      name='price' id={`${item}`} className='ml-1'/>{" "}
                    <label name='price' htmlFor={`${item}`} className='ml-1'>{item}</label>
                  </div>
                );
              })}
            </div>
          </div>
          {/* -------------------- */}
          
           <div className='py-2 w-[48%] rounded flex items-center justify-between'>
            <div className='mr-5 '>M??h??rrikin g??c??, a . g :</div>

            <div className='w-[250px] flex items-center'>
              <input
                value={values?.enginePowerValue}
                onChange={(e) => setValues({ ...values,enginePowerValue: e.target.value })}
                type='number'
                placeholder='0'
                min='0'
                className='w-[110px] px-2 bg-white text-black border-gray-400 border rounded flex items-center min-h-[38px] outline-none'
              />
              </div>
            </div>
          <Input
            name={"Ne????nci sahibisiniz ?"}
            options={data.priorOwnerCount}
            value={values.priorOwnerCountValue}
            onChange={(e)=>setValues({...values,priorOwnerCountValue: e})}
            placeholder={"Ne????nci sahibisiniz ?"}
          />
          <Input
            name={"Hans?? bazar ??????n y??????l??b"}
            options={data.market}
            value={values.marketValue}
            onChange={(e)=>setValues({...values,marketValue: e})}
            placeholder={"Hans?? bazar ??????n y??????l??b"}
          />
          <Input
            name={"????h??r"}
            options={data.city}
            value={values.cityValue}
            onChange={(e) => setValues({...values, cityValue: e })}
            placeholder={"????h??r"}
          />
          <Input
            name={"Yerl??rin say??"}
            options={data.seatsCount}
            value={values.seatsCountValue}
            onChange={(e) => setValues({...values, seatsCountValue: e })}
            placeholder={"Yerl??rin say??"}
          />
          {/* ---SITUATION--- */}
          <div className=' pt-2 pb-2 w-[48%] rounded flex items-center justify-between'>
            <div className='mr-5'>V??ziyy??ti :</div>

            <div className='w-[250px] flex items-center'>
              <input onChange={(e)=>setValues({...values,crashedValue:e.target.checked})} type='checkbox' id='checkbox1' />
              <label htmlFor='checkbox1' className='mx-2'>
                Vuru??u var
              </label>
              <input onChange={(e)=>setValues({...values,paintedValue:e.target.checked})} type='checkbox' id='checkbox2' />
              <label htmlFor='checkbox2' className='ml-2'>
                R??ngl??nib
              </label>
            </div>
          </div>
          {/* -------------------- */}
          {/* ------ */}
          <div className=' pt-2 pb-2 w-[48%] rounded flex items-center justify-between'>
            <div className='mr-5'>Kredit :</div>

            <div className='w-[250px] flex items-center'>
              <input onChange={(e)=>setValues({...values,loanValue:e.target.checked})} type='checkbox' id='checkbox3' />
              <label htmlFor='checkbox3' className='mx-1'>
                Kredit??dir
              </label>
              <input type='checkbox' id='checkbox4' />
              <label htmlFor='checkbox4' className='ml-1'>
                Barter m??mk??nd??r
              </label>
            </div>
          </div>
          {/* -------------------- */}
          {/*TEXT AREA */}
          <div className=' pt-2 pb-2 w-full rounded flex justify-between'>
            <div className='mr-5'>??lav?? m??lumat :</div>

            <div className='w-4/5  rounded text-sm '>
              <textarea
                value={values.descriptionValue}
                onChange={(e) =>
                  setValues({ ...values,descriptionValue: e.target.value })
                }
                className='w-full min-h-16 border rounded border-gray-400 outline-none px-3 py-1'
              ></textarea>
              <div>Telefon n??mr??l??ri qeyd etm??k qada??and??r!</div>
            </div>
          </div>
          {/* -------------------- */}
          {/*-------PHONE NUMBER---------*/}
          <div className=' pt-2 pb-2 w-full rounded flex justify-between items-center'>
            <div className='mr-5'>??lav?? m??lumat :</div>

            <div className='w-4/5  rounded text-sm '>
              <input value={inputValue} maxLength='14' onChange={handleInput} type='tel' placeholder="(000) 000-00-00" className="w-[200px] px-2 bg-white text-black border-gray-400 border rounded flex items-center h-[30px] outline-none"/>
            </div>
          </div>
          {/*--------------------------- */}
          {/* CAR PROPERTIES */}
          <div className='flex flex-col w-full'>
            <div className='font-semibold text-xl'>Avtomobilin t??chizat??</div>
            <div className='flex flex-wrap items-center justify-between'>
              {data.extraBooleanFields.map((item, index) => {
                return (
                  <div key={index} className='min-w-[200px] p-1'>
                    <input onChange={handleChange} value={index+1} type='checkbox' id={index+1} />{" "}
                    <label htmlFor={index+1}>{item}</label>
                  </div>
                );
              })}
            </div>
          </div>
          {/*-----------------------  */}

          {/* PICTURES */}
          <div className='font-semibold text-xl'>????kill??r</div>
          <div className='border border-gray-400 w-full min-h-[170px] flex items-center'>
            {/* RULES */}
            <div
              className={`${
                selectedImages.length > 3 ? "hidden" : ""
              } w-2/5 text-sm px-4`}
            >
              <div>
                - Minimum ??? 3 ????kil (??n, arxa v?? b??t??v ??n panelin g??r??nt??s??
                m??tl??qdir).
              </div>
              <div>- Maksimum ??? 21 ????kil.</div>
              <div>- Optimal ??l???? ??? 1024x768 piksel.</div>
            </div>
            <Picture />
          </div>
          {/* ------------------- */}
          <button className={`p-1 bg-red-500`}>Elan?? payla??</button>
        </form>
      </div>
    </>
  );
};

export default NewAnnouncement;

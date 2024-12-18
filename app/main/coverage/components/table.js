import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Select, notification } from 'antd';
import moment from 'moment';
import { FaArrowDown } from 'react-icons/fa';
import { FaAnglesDown, FaAnglesUp } from "react-icons/fa6";

const Table = ({ datas, markerPosition, session, showOrderCreation, setShowOrderCreation }) => {
  const [form] = Form.useForm();
  const [currentDate, setCurrentDate] = useState(null);
  const [completionDate, setCompletionDate] = useState(null);

  const [generateCustomerId] = useState(() => {
    return `${session.user.name.slice(0, 3).toUpperCase()}-${moment().valueOf()}`;
  });

  const qosOptions = [
    {
      "ProductName": "4 Mbps"
    },
    {
      "ProductName": "5 Mbps"
    },
    {
      "ProductName": "6 Mbps"
    },
    {
      "ProductName": "7 Mbps"
    },
    {
      "ProductName": "10 Mbps"
    },
    {
      "ProductName": "12 Mbps"
    },
    {
      "ProductName": "15 Mbps"
    },
    {
      "ProductName": "20 Mbps"
    },
    {
      "ProductName": "23 Mbps"
    },
    {
      "ProductName": "25 Mbps"
    },
    {
      "ProductName": "30 Mbps"
    },
    {
      "ProductName": "33 Mbps"
    },
    {
      "ProductName": "35 Mbps"
    },
    {
      "ProductName": "40 Mbps"
    },
    {
      "ProductName": "50 Mbps"
    },
    {
      "ProductName": "70 Mbps"
    },
    {
      "ProductName": "75 Mbps"
    },
    {
      "ProductName": "100 Mbps"
    },
    {
      "ProductName": "150 Mbps"
    },
    {
      "ProductName": "200 Mbps"
    },
    {
      "ProductName": "300 Mbps"
    },
    {
      "ProductName": "500 Mbps"
    },
    {
      "ProductName": "1000 Mbps"
    }
  ]

  const listInput = ['Customer Name', 
    'Phone Number', 'Street Name', 'Street Number', 'Full Address'] 

  useEffect(() => {
    const interval = setInterval(() => {
      const newDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
      setCurrentDate(newDateTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [form]);


  const onFinish = async (values) => {
    const email = session.user.email
    const password = session.user.token
    const payload = {
      "externalId": generateCustomerId,
      "priority": "1",
      "category": "B2C",
      "orderDate": "2024-09-30T04:10:15.673Z",
      "requestedCompletionDate": completionDate,
      "note": [
        {
          "text": values['Full Address']
        },
        {
          "text": values['Phone Number']
        },
        {
          "text": "99999999"
        }
      ],
      "relatedParty": [
        {
          "id": generateCustomerId,
          "role": "Customer",
          "name": values['Customer Name'],
          "contactMedium": [
            {
              "mediumType": "telephone",
              "phoneNumber": values['Phone Number']
            },
            {
              "mediumType": "telephone",
              "phoneNumber": "99999999"
            }
          ],
          "address": {
            "streetNr": values['Street Number'],
            "streetName": values['Street Name'],
            "streetSuffix": "",
            "streetNrLast": "",
            "streetNrLastSuffix": "",
            "streetNrSuffix": "",
            "streetType": "",
            "postcode": datas['Post Code'],
            "locality": datas['Locality'],
            "city": datas['City'],
            "stateOrProvince": datas['Province'],
            "district": datas['Locality'].split('|')[0],
            "subDistrict": datas['Locality'].split('|')[1],
            "longitude": `${markerPosition.lng}`,
            "latitude": `${markerPosition.lat}`,
            "country": "Indonesia",
            "baseType": "geoAddress",
            "type": "activeAddress",
            "schemaLocation": ""
          }
        },
        {
          "id": "ASIANET MEDIA TEKNOLOGI",
          "role": "Seller",
          "name": "ASIANET MEDIA TEKNOLOGI"
        }
      ],
      "productOrderItem": [
        {
          "id": generateCustomerId,
          "action": "add",
          "quantity": "1",
          "product": {
            "isBundle": true,
            "@type": "Product",
            "productSpecification": {
              "id": "205",
              "href": "/productCatalogManagement/v5/productSpecification/153",
              "name": values['QoS'],
              "version": "1",
              "@type": "ProductSpecificationRef"
            },
            "productCharacteristic": [
              {
                "name": "QOS",
                "id": "1",
                "@type": "device",
                "value": "Internet",
                "valueType": "string"
              }
            ]
          }
        }
      ],
      "place": [
        {
          "id": datas['Homepass'],
          "@baseType": "homepass",
          "@type": "new"
        }
      ],
      "@type": "installationOrder"
    }
  
    try {
      const response = await fetch('/api/workorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          payload,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        notification.error({
          message: 'Error',
          description: `Error: ${errorData.returnMessage} (${errorData.statusCode})`,
          placement: 'top',
          duration: null
        });
        return;
      }
  
      const result = await response.json();
      if(result.id){
        notification.success({
          message: 'Success!',
          description: `OrderId: ${result.id}`,
          placement: 'top',
          duration: null
        });
      }
    } catch (error) {
      console.error('Fetch failed:', error.message);
    }
  }



  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className='font-quicksand px-1 mt-2'
    >
      <div 
        onClick={() => setShowOrderCreation(!showOrderCreation)} 
        className='flex justify-center gap-2 items-center font-quicksand text-xs pb-1 pt-2 sm:pt-4 font-bold 
          text-amtblue border-t-2 border-green-500/20 hover:cursor-pointer hover:drop-shadow-md hover:scale-105 transition-all duration-500'>
        <h2>Order Creation Form</h2>
        {showOrderCreation ? (
          <FaAnglesUp
            size={8}
            className="text-amtblue" 
          />
        ) : (
          <FaAnglesDown
            size={8}
            className="text-amtblue" 
          />
        )}
      </div>
      
      <div className={`${showOrderCreation ? '' : 'hidden'}`}>
        <table className={`w-full text-xxs rounded-md shadow-md border overflow-hidden `}>
          <tbody>
            <tr>
              <td className="w-[35%] px-2 py-1 text-right font-bold border-b border-slate-50 bg-slate-200">
                Customer ID
              </td>
              <td className="w-[65%] p-0 border border-slate-200 overflow-hidden">
                <Input
                  value={generateCustomerId}
                  readOnly
                  className="px-3 py-1.5 text-xs font-bold border-none rounded-none text-green-600 bg-slate-50 hover:bg-slate-50 focus:bg-slate-50"
                />
              </td>
            </tr>

            {listInput.map((i) => (
              <tr key={i}>
                <td className="w-[35%] px-2 py-1 text-right font-bold border-b border-slate-50 bg-slate-200">
                  {i}
                </td>
                <td className="w-[65%] h-full p-0 m-0 border border-slate-200 overflow-hidden bg-slate-50">
                  <Form.Item
                    name={i}
                    className='p-0 m-0 mx-2'
                    rules={[{ required: true, message: `${i} is required!` }]}
                  >
                    <Input className="px-2 border-none rounded-md shadow-sm text-xs my-1.5" />
                  </Form.Item>
                </td>
              </tr>
            ))}

            {Object.entries(datas).map(([key, value]) => (
              <tr key={key}>
                <td className="w-[35%] px-2 py-1 text-right font-bold border-b border-slate-50 bg-slate-200">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </td>
                <td className="w-[65%] p-0 border border-slate-200 overflow-hidden">
                  <Input
                    value={value}
                    readOnly
                    className="px-3 py-1 text-xs border-none rounded-none bg-slate-50 hover:bg-slate-50 focus:bg-slate-50"
                  />
                </td>
              </tr>
            ))}
            
            <tr>
              <td className="w-[35%] px-2 py-1 text-right font-bold border-b border-slate-50 bg-slate-200">
                QoS
              </td>
              <td className="w-[65%] p-0 border border-slate-200 bg-slate-50 overflow-hidden">
                <Form.Item
                    name='QoS'
                    className='p-0 py-0.5 m-0 mx-1'
                    rules={[{ required: true, message: `QoS is required!` }]}
                  >
                  <Select
                    className="w-full"
                    placeholder="Select QoS"
                    showSearch
                    options={qosOptions.map((item) => ({
                      label: item.ProductName,
                      value: item.ProductName,
                    }))}
                  />
                </Form.Item>
              </td>
            </tr>


            <tr>
              <td className="w-[35%] px-2 py-1 text-right font-bold border-b border-slate-50 bg-slate-200">
                Req. Completion
              </td>
              <td className="w-[65%] p-0 px-1 border border-slate-200 bg-slate-50 overflow-hidden">
                <Form.Item
                    name='Req Completion Date'
                    className='p-0 py-0.5 m-0 mx-1'
                    rules={[{ required: true, message: `Req Completion Date is required!` }]}
                  >
                  <DatePicker
                    placeholder='Completion Date'
                    showTime
                    disabledDate={(current) => current && current < moment().startOf('day')}
                    // format="YYYY-MM-DD HH:mm:ss"
                    onChange={(date, dateString) => setCompletionDate(date)}
                  />
                  </Form.Item>
              </td>
            </tr>
            <tr>
              <td className="w-[35%] px-2 py-1 text-right font-bold border-b border-slate-50 bg-slate-200">
                Order Date
              </td>
              <td className="w-[65%] p-0 border border-slate-200 overflow-hidden">
                <Input
                  value={currentDate}
                  readOnly
                  className="px-3 py-1.5 text-xs border-none rounded-none bg-slate-50 hover:bg-slate-50 focus:bg-slate-50"
                />
              </td>
            </tr>

            

          </tbody>
        </table>

        <div className='flex justify-center'>
          <button className='w-40 mt-4 mb-2 sm:mb-10 p-1 text-xs font-bold rounded-lg shadow-md 
          text-white bg-gradient-to-br from-amber-400 to-amtorange
          transition-all duration-500 hover:shadow-lg hover:scale-105'
          >
            Create Order
          </button>

        </div>
      </div>

    </Form>
  );
};

export default Table;

import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getSnmpStatus: builder.query({           
      query: () => "/api/v1/auto_discovery_dashboard/get_snmp_status_graph",
    }),


    
    getCredentialsSummary: builder.query({
      query: () => "/api/v1/auto_discovery_dashboard/get_credentials_graph",
      
    }),
   

    // getSubnetSummary: builder.query({           
    //   query: () => "/api/v1/ipam/ipam_dashboard/subnet_summary",
    // }),
    //  getNcmChangeByVendor: builder.query({           
    //   query: () => "/api/v1/ncm/ncm_dashboard/get_vendors_in_ncm",
    // }),



    // getIpAvailibility: builder.query({           
    //   query: () => "/api/v1/ipam/ipam_dashboard/ip_availability_summary",
    // }),

    
    // getTopTenOpenPorts: builder.query({           
    //   query: () => "/api/v1/ipam/ipam_dashboard/tcp_open_ports",
    // }),
    // getDns: builder.query({           
    //   query: () => "/api/v1/ipam/ipam_dashboard/dns_summary",
    // }),

   

   
  
    getConfigurationChangeByDevice: builder.query({           
      query: () => "/api/v1/ncm/ncm_dashboard/ncm_change_summery_by_device",
    }),
    // getRecentRcmAlarms: builder.query({           
    //   query: () => "/api/v1/ncm/ncm_dashboard/ncm_alarm_summery",
    // }),
    // getRecentRcmAlarmsCount: builder.query({           
    //   query: () => "/api/v1/ncm/ncm_dashboard/get_ncm_alarm_by_category_graph",
    // }),
    // getNcmDeviceSummaryTable: builder.query({           
    //   query: () => "/api/v1/ncm/ncm_dashboard/ncm_device_summary_by_fucntion",
    // }),
   
    // getConfigurationChangeByVendor: builder.query({           
    //   query: () => "/api/v1/ncm/ncm_dashboard/get_vendors_in_ncm",
    // }),

    
  


  }),
});

export const {
  useGetSnmpStatusQuery, useGetCredentialsSummaryQuery, useGetConfigurationChangeByDeviceQuery
} = extendedApi;

import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getSnmpStatus: builder.query({           
      query: () => "/api/v1/auto_discovery_dashboard/get_snmp_status_graph",
    }),


    
    getCredentialsSummary: builder.query({
      query: () => "/api/v1/auto_discovery_dashboard/get_credentials_graph",
      
    }),
    getTopVendorForDiscovery: builder.query({
        query: () => "/api/v1/auto_discovery_dashboard/get_top_vendors_for_discovery",
        
      }),
      getTopOs: builder.query({
        query: () => "/api/v1/auto_discovery_dashboard/get_top_os_for_discovery",
        
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


  


  }),
});

export const {
  useGetSnmpStatusQuery, useGetCredentialsSummaryQuery, useGetTopVendorForDiscoveryQuery, useGetTopOsQuery
} = extendedApi;

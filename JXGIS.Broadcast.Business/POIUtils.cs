using JXGIS.Broadcast.BaseLib;
using JXGIS.Broadcast.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.Broadcast.Business
{
    public class POIUtils
    {
        public static POIObject GetPOIObject(string keyWord, string pageIndex, string pageSize)
        {
            string POIUrl = SystemUtility.Config.POIUrl;
            string postUrl = string.Format(POIUrl, keyWord, pageIndex, pageSize);
            string returnJson = ServiceUtilities.Get(postUrl, Encoding.UTF8);
            POIObject POIObj = Newtonsoft.Json.JsonConvert.DeserializeObject<POIObject>(returnJson);
            return POIObj;
        }

        public static Dictionary<string, object> GetPOIForDataGrid(string keyWord, string pageIndex, string pageSize)
        {
            Dictionary<string, object> dic = new Dictionary<string, object>();
            POIObject POIObj = GetPOIObject(keyWord, pageIndex, pageSize);
            dic.Add("total", POIObj.counts);
            dic.Add("rows", POIObj.records);
            return dic;
        }
    }
}

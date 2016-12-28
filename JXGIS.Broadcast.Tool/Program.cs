using Aspose.Cells;
using JXGIS.Broadcast.BaseLib;
using JXGIS.Broadcast.Business;
using JXGIS.Broadcast.Entity;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Spatial;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace JXGIS.Broadcast.Tool
{

    class Program
    {
        public static void Main(string[] args)
        {
            var s = @"http://www.tianditu.cn/query.shtml?&postStr={%27orig%27:%27120.99328827628801,30.714555115856%27,%27dest%27:%27121.03242707001601,30.707087846%27,%27style%27:%27undefined%27,%27mid%27:%27%27}&type=search&dataType=json&ajaxType=post&abort_name=cal_route_xhr&success=as_cal_route&1473815767467";
            s = HttpUtility.UrlDecode(s);

            WebClient wc = new WebClient();
            wc.Encoding = Encoding.UTF8;
            s = wc.DownloadString(s);
        }
    }
}
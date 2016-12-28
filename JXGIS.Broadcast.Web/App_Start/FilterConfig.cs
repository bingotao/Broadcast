using System.Web;
using System.Web.Mvc;

namespace JXGIS.Broadcast.Web
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new AdminAuthorizeAttribute());
            filters.Add(new BroadcastActionFilterAttribute());
        }
    }
}
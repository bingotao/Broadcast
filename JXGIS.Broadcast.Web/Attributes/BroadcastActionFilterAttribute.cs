using JXGIS.Broadcast.BaseLib;
using System;
using System.Web.Mvc;

namespace JXGIS.Broadcast.Web
{

    public class BroadcastActionFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            try
            {
                filterContext.Controller.ViewBag.ArcGISJSReferencePath = SystemUtility.Config.ArcGISJSReferencePath;
                filterContext.Controller.ViewBag.Title = SystemUtility.Config.Title;
                filterContext.Controller.ViewBag.Extent = SystemUtility.Config.Extent;
                string appPath = filterContext.HttpContext.Request.ApplicationPath;
                filterContext.Controller.ViewBag.BaseUrl = appPath == "/" ? string.Empty : appPath;
                filterContext.Controller.ViewBag.PublicKey = SystemUtility.Config.RSA.PublicKey;
                filterContext.Controller.ViewBag.DEBUG = "false";
#if DEBUG
                filterContext.Controller.ViewBag.DEBUG = "true";
#endif
            }
            catch (Exception ex)
            {

            }
            finally
            {

            }
        }
    }
}
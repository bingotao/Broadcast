using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(JXGIS.Broadcast.Web.Startup))]
namespace JXGIS.Broadcast.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
        }
    }
}

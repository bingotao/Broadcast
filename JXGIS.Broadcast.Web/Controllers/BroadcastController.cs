using JXGIS.Broadcast.BaseLib;
using JXGIS.Broadcast.Business;
using JXGIS.Broadcast.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Web.Mvc;
using System.Web.SessionState;

namespace JXGIS.Broadcast.Web.Controllers
{
    [AdminAuthorize]
    public class BroadcastController : Controller, IRequiresSessionState
    {
        private EFDbContext dbContext = SystemUtility.EFDbContext;

        public ActionResult Test()
        {
            //var v = this.dbContext.PublishedDetail.Where(p => p.ID == "1").FirstOrDefault();

            CapturedInfo c = new CapturedInfo();
            PublishedDetail p = new PublishedDetail();
            Feedback f = new Feedback();
            ReportInfo r = new ReportInfo();
            User u = new User();

            return PartialView("Test", "_Layout");
        }

        [AllowAnonymous]
        public ActionResult Index()
        {
            return View("Index");
        }

        [AllowAnonymous]
        public ActionResult BroadcastMap()
        {
            return View("BroadcastMap", "_Layout");
        }

        public ActionResult BroadcastAdmin()
        {
            ViewBag.IsAdmin = UserUtils.GetUser().IsAdmin;
            return View("BroadcastAdmin", "_Layout");
        }

        public ActionResult UnpassReview(ReviewItem reviewItem)
        {
            ReturnObject ro = null;
            try
            {
                ReviewUtils.UnpassReview(this.dbContext, reviewItem);
                ro = new ReturnObject();
            }
            catch (Exception ex)
            {
                ro = new ReturnObject(ex.Message);
            }
            return Json(ro);
        }

        [ValidateInput(false)]
        public ActionResult DeletePublish(PublishedDetail publishedDetail)
        {
            ReturnObject ro = null;
            try
            {
                PublishUtils.DeletePublish(this.dbContext, publishedDetail);
                ro = new ReturnObject();
            }
            catch (Exception ex)
            {
                ro = new ReturnObject(ex.Message);
            }
            return Json(ro);
        }

        public ActionResult GetUsers()
        {
            ReturnObject ro = null;
            try
            {
                if (!UserUtils.GetUser().IsAdmin) throw new Exception("没有权限");
                else
                {
                    ro = new ReturnObject();
                    var users = (from u in this.dbContext.User
                                 select new
                                 {
                                     ID = u.ID,
                                     UserName = u.UserName,
                                     CreateTime = u.CreateTime
                                 }
                                ).ToList();
                    ro.AddData("Users", users);
                }
            }
            catch (Exception ex)
            {
                ro = new ReturnObject(ex.Message);
            }
            string rtStr = CustomerSerialize.Serialize(ro);
            return Content(rtStr);
        }

        public ActionResult DeleteUser(string id)
        {
            ReturnObject ro = null;
            try
            {
                if (!UserUtils.GetUser().IsAdmin)
                    throw new Exception("无权限！");
                else
                {
                    User user = this.dbContext.User.Where(p => p.ID == id).FirstOrDefault();
                    if (user != null)
                    {
                        this.dbContext.User.Remove(user);
                        this.dbContext.SaveChanges();
                    }
                    else
                        throw new Exception("未找到该用户");
                }
                ro = new ReturnObject();
            }
            catch (Exception ex)
            {
                ro = new ReturnObject(ex.Message);
            }
            return Json(ro);
        }

        public ActionResult SaveUser(RUser user)
        {
            ReturnObject ro = null;
            var admin = UserUtils.GetUser();
            if (!UserUtils.GetUser().IsAdmin)
            {
                ro = new ReturnObject("该用户无权限！");
            }
            else
            {
                try
                {
                    using (TransactionScope trans = new TransactionScope())
                    {
                        var u = this.dbContext.User.Where(p => p.ID == user.ID).FirstOrDefault();
                        string password = new RSACryptoService(SystemUtility.Config.RSA.PrivateKey.ToString()).Decrypt(user.Password);

                        if (u == null)
                        {
                            u = new User()
                            {
                                ID = Guid.NewGuid().ToString(),
                                UserName = user.UserName,
                                Password = password,
                                LastModifyUser = admin.ID,
                                LastModifyTime = DateTime.Now,
                                CreateUser = admin.ID,
                                CreateTime = DateTime.Now
                            };
                            this.dbContext.User.Add(u);
                        }
                        else
                        {
                            if (this.dbContext.User.Where(p => p.ID != user.ID && p.UserName == user.UserName).FirstOrDefault() != null)
                                throw new Exception("用户重名，请修改用户名！");
                            else
                            {
                                u.UserName = user.UserName;
                                u.Password = password;
                                u.LastModifyTime = DateTime.Now;
                                u.LastModifyUser = admin.ID;
                            }
                        }
                        this.dbContext.SaveChanges();
                        trans.Complete();
                    }
                    ro = new ReturnObject();
                }
                catch (Exception ex)
                {
                    ro = new ReturnObject(ex.Message);
                }
            }
            return Json(ro);
        }

        [AllowAnonymous]
        public ActionResult GetPOI(string keyWord)
        {

            Dictionary<string, object> data = null;
            try
            {
                string page = this.Request.Form["page"];
                string rows = this.Request.Form["rows"];
                data = POIUtils.GetPOIForDataGrid(keyWord, page, rows);
            }
            catch
            {
                data = new Dictionary<string, object>() { };
                data.Add("total", 0);
                data.Add("rows", new object[] { });
            }
            return Json(data);
        }

        public ActionResult CapturedInfoView(string ID)
        {
            CapturedInfo capturedInfo = this.dbContext.CapturedInfo.Where(p => p._ID.ToString() == ID).FirstOrDefault();
            return PartialView("CapturedInfoView", capturedInfo);
        }

        public ActionResult ReportedInfoView(string ID)
        {
            ReportInfo reportInfo = this.dbContext.ReportInfo.Where(p => p.ID == ID).FirstOrDefault();
            return PartialView("ReportedInfoView", reportInfo);
        }

        [AllowAnonymous]
        public ActionResult GetPublish()
        {
            var list = PublishUtils.GetPublishInfoForMap();
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(list, new CustomNullableDateTimeConverter());
            return Content(json);
        }

        public ActionResult GetPublishInfoForGrid(PublishConditon publishConditon)
        {

            var dict = PublishUtils.GetPublishInfoForGrid(this.dbContext, publishConditon);
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(dict, new CustomNullableDateTimeConverter());
            return Content(json);
        }

        /// <summary>
        /// 保存发布
        /// </summary>
        /// <param name="objstr"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult SavePublish()
        {
            ReturnObject ro = null;
            try
            {
                var json = this.Request.Form["json"];
                PublishUtils.SavePublish(this.dbContext, json);
                ro = new ReturnObject();
            }
            catch (Exception ex)
            {
                ro = new ReturnObject(ex.Message);
            }
            return Json(ro);
        }

        /// <summary>
        /// 用户上报
        /// </summary>
        /// <param name="reportInfo"></param>
        /// <returns></returns>
        public ActionResult Report(ReportInfo reportInfo)
        {
            ReturnObject ro = null;
            try
            {
                ValidateReportRule();
                reportInfo.ReportTime = DateTime.Now;
                reportInfo.ClientInfo = GetClintInfo();
                reportInfo.ID = Guid.NewGuid().ToString();
                using (TransactionScope scope = new TransactionScope())
                {
                    dbContext.ReportInfo.Add(reportInfo);
                    dbContext.SaveChanges();
                    scope.Complete();
                }
                ro = new ReturnObject();
            }
            catch (Exception ex)
            {
                ro = new ReturnObject(ex.Message);
            }
            return Json(ro);
        }

        /// <summary>
        /// 获取审核列表
        /// </summary>
        /// <param name="reviewCondition"></param>
        /// <returns></returns>
        public ActionResult GetReviewList(ReviewCondition reviewCondition)
        {
            var rt = ReviewUtils.GetReviewList(this.dbContext, reviewCondition);
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(rt, new CustomNullableDateTimeConverter());
            return Content(json);
        }

        /// <summary>
        /// 获取上报客户端信息
        /// </summary>
        /// <returns></returns>
        private string GetClintInfo()
        {
            string mac = NetHelper.GetMacAddr_Remote();
            string ip = NetHelper.GetClientIP();
            string sys = NetHelper.GetSysVersion();
            string browserType = NetHelper.GetBrowserType();
            string hostName = NetHelper.GetHostName();
            return string.Format("MAC:{0}\nIP:{1}\nSYSTEM:{2}\nBROWSER:{3}\nHOSTNAME:{4}", mac, ip, sys, browserType, hostName);
        }


        /// <summary>
        /// 一次会话，5分钟一次提交规则
        /// </summary>
        private void ValidateReportRule()
        {
#if !DEBUG
            object lastReportTime = this.Session["LastReportTime"];
            if (lastReportTime == null)
            {
                this.Session["LastReportTime"] = DateTime.Now;
            }
            else
            {
                DateTime time = (DateTime)lastReportTime;
                if ((DateTime.Now - time).Minutes > 2)
                {
                    this.Session["LastReportTime"] = DateTime.Now;
                }
                else
                {
                    throw new Exception("提交过于频繁，请稍后再试！");
                }
            }
#endif
        }

        [AllowAnonymous]
        public ActionResult Login()
        {
            ReturnObject ro = new ReturnObject();
            string UserName = this.Request.Form["UserName"];
            string Password = this.Request.Form["Password"];

            User user = LoginUtils.ValidateUser(UserName, Password);
            if (user == null)
            {
                ro.ErrorMessage = "用户名或密码错误！";
            }
            else
            {
                UserUtils.SetUser(user);
                ro.AddData("Link", "BroadcastAdmin");
            }
            return Content(Newtonsoft.Json.JsonConvert.SerializeObject(ro));
        }

        public ActionResult Logout()
        {
            ReturnObject ro = new ReturnObject();
            LoginUtils.Logout();
            return Content(Newtonsoft.Json.JsonConvert.SerializeObject(ro));
        }

        [AllowAnonymous]
        public ActionResult CommentPublish(Comment comment)
        {
            ReturnObject ro = new ReturnObject(); ;
            try
            {
                if (!string.IsNullOrWhiteSpace(comment.ID) && (!string.IsNullOrWhiteSpace(comment.Content) || comment.Useful != null))
                {
                    Feedback feedback = new Feedback()
                    {
                        ID = Guid.NewGuid().ToString(),
                        PB_ID = comment.ID,
                        Content = comment.Content,
                        IsUseful = comment.Useful,
                        CreateTime = DateTime.Now,
                        IP = GetClintInfo(),
                        IsValid = 1
                    };
                    this.dbContext.Feedback.Add(feedback);
                    this.dbContext.SaveChanges();
                }
                else
                    throw new Exception("信息不全");
            }
            catch (Exception ex)
            {
                ro.ErrorMessage = ex.Message;
            }
            return Json(ro);
        }

        public ActionResult GetComment(string id)
        {
            ReturnObject ro = new ReturnObject();
            try
            {
                var query = (from f in this.dbContext.Feedback
                             where f.PB_ID == id && f.IsValid == 1
                             select f).ToList();

                var useful = query.Where(p => p.IsUseful == 1).Count();
                var uncorrect = query.Where(p => p.IsUseful == 0).Count();

                var comments = (from i in query
                                where i.IsUseful == null
                                select new
                                {
                                    ID = i.ID,
                                    Content = i.Content,
                                    CreateTime = i.CreateTime,
                                    IP = i.IP
                                }).ToList();
                ro.AddData("Useful", useful);
                ro.AddData("Uncorrect", uncorrect);
                ro.AddData("Rows", comments);
            }
            catch (Exception ex)
            {
                ro.ErrorMessage = ex.Message;
            }

            string json = Newtonsoft.Json.JsonConvert.SerializeObject(ro, new CustomNullableDateTimeConverter());
            return Content(json);
        }
    }


    public class Comment
    {
        public string ID { get; set; }

        public int? Useful { get; set; }

        public string Content { get; set; }
    }


    public class RUser
    {
        public string ID { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
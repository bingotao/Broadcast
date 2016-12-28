using JXGIS.Broadcast.BaseLib;
using JXGIS.Broadcast.BaseLib.Utilities;
using JXGIS.Broadcast.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;

namespace JXGIS.Broadcast.Business
{
    public class PublishUtils
    {
        public static Dictionary<string, object> GetPublishInfoForGrid(EFDbContext dbContext, PublishConditon conditon)
        {
            var cdt = conditon;

            var query = (from p in dbContext.PublishedDetail
                         where
                         p.IsValid == 1
                         && p.PublishTime >= cdt.beginDate && p.PublishTime <= cdt.endDate
                         && (string.IsNullOrEmpty(cdt.keyWord) ? true : (p.Title.Contains(cdt.keyWord) || p.Content.Contains(cdt.keyWord)))
                         && cdt.status.Contains(p.Status)
                         && cdt.urgencey.Contains(p.Urgency)
                         && cdt.catagory.Contains(p.Catagory)
                         && (cdt.isExpire ? p.ExpirationTime < DateTime.Now : true)//过期
                         && (cdt.hasFeedback ? dbContext.Feedback.Where(f => f.PB_ID == p.ID).Count() > 0 : true)
                         select p
               );

            List<PublishedDetail> list = query.OrderByDescending(p => p.PublishTime).Skip((cdt.page - 1) * cdt.rows).Take(cdt.rows).ToList();
            var dict = new Dictionary<string, object>();
            dict["rows"] = list;
            dict["total"] = query.Count();
            return dict;
        }


        public static void SavePublish(EFDbContext dbContext, string json)
        {
            PublishedDetail entity = null;
            var pk = EntityUtils.GetPrimaryKey<PublishedDetail>(json, out entity);
            using (TransactionScope scope = new TransactionScope())
            {
                User user = UserUtils.GetUser();
                //修改
                if (!string.IsNullOrEmpty(pk) && (entity = dbContext.PublishedDetail.Where(p => p.ID == pk).FirstOrDefault()) != null)
                {
                    EntityUtils.UpdateEntityByJson<PublishedDetail>(json, entity);
                }
                //新增
                else
                {
                    entity.ID = Guid.NewGuid().ToString();
                    entity.CreateTime = DateTime.Now;
                    dbContext.PublishedDetail.Add(entity);
                    entity.CreateUser = user.ID;
                }
                //更新来源表状态
                if (entity.SourceType == SourceTypes.captured)
                {
                    var captured = dbContext.CapturedInfo.Where(p => p._ID.ToString() == entity.SourceID).FirstOrDefault();
                    captured.Status = ReviewStatusTypes.passed;
                }
                else if (entity.SourceType == SourceTypes.report)
                {
                    var report = dbContext.ReportInfo.Where(p => p.ID == entity.SourceID).FirstOrDefault();
                    report.Status = ReviewStatusTypes.passed;
                }

                entity.LastModifyTime = DateTime.Now;
                entity.LastModifyUser = user.ID;

                dbContext.SaveChanges();
                scope.Complete();
            }
        }

        public static void DeletePublish(EFDbContext dbContext, PublishedDetail publishDetail)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                PublishedDetail entity = GetPublish(dbContext, publishDetail.ID);
                if (entity == null)
                    throw new Exception("未找到相应数据");
                else
                {
                    entity.IsValid = 0;
                    dbContext.SaveChanges();
                    scope.Complete();
                }
            }
        }

        public static PublishedDetail GetPublish(EFDbContext dbContext, string id)
        {
            return dbContext.PublishedDetail.Where(p => p.ID == id).FirstOrDefault();
        }

        public static List<PublishedItem> GetPublishInfoForMap()
        {

            var query = (
                from p in SystemUtility.EFDbContext.PublishedDetail
                join
f2 in (from f in SystemUtility.EFDbContext.Feedback
       group f by f.PB_ID into g
       select new SumFeedback
       {
           ID = g.Key,
           Useful = g.Sum(i => i.IsUseful > 0 ? 1 : 0),
           Uncorrect = g.Sum(i => i.IsUseful == null || i.IsUseful > 0 ? 0 : 1)
       })
       on p.ID equals f2.ID into u
                where
                p.ExpirationTime > DateTime.Now
                && p.IsValid == 1
                && p.Status == PublishStatusTypes.published

                from f2 in u.DefaultIfEmpty()
                select new PublishedItem
                {
                    ID = p.ID,
                    Catagory = p.Catagory,
                    Title = p.Title,
                    Urgency = p.Urgency,
                    Content = p.Content,
                    PublishTime = p.PublishTime,
                    ExpirationTime = p.ExpirationTime,
                    Geometry = p.Geometry,
                    Useful = f2.Useful ?? 0,
                    Uncorrect = f2.Uncorrect ?? 0
                }).OrderByDescending(p => p.PublishTime).ThenByDescending(p => p.Urgency == UrgencyTypes.mosturgent ? 4 : (p.Urgency == UrgencyTypes.urgent ? 3 : (p.Urgency == UrgencyTypes.important ? 2 : 1)));
            return query.ToList();
        }
    }


    public class SumFeedback
    {
        public string ID { get; set; }
        public int? Useful { get; set; }
        public int? Uncorrect { get; set; }
    }

    public class PublishedItem
    {
        public string ID { get; set; }

        public string Catagory { get; set; }


        public string Title { get; set; }

        public string Urgency { get; set; }

        public string Content { get; set; }

        public DateTime? PublishTime { get; set; }


        public DateTime? ExpirationTime { get; set; }

        public string Geometry { get; set; }

        public int Useful { get; set; }

        public int Uncorrect { get; set; }
    }
}

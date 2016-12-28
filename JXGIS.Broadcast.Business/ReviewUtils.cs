using JXGIS.Broadcast.BaseLib;
using JXGIS.Broadcast.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace JXGIS.Broadcast.Business
{
    public class ReviewUtils
    {

        public static Dictionary<string, object> GetReviewList(EFDbContext dbContext, ReviewCondition rCdts)
        {
            var query = (from c in dbContext.CapturedInfo
                         where
                             (rCdts.status.Contains(c.Status) || (rCdts.status.Contains(ReviewStatusTypes.pending) ? string.IsNullOrEmpty(c.Status) : true)) &&
                             rCdts.catagory.Contains(c.Catagory)
                         select new ReviewItem
                         {
                             SourceID = c._ID.ToString(),
                             Title = c.Title,
                             Content = c.Content,
                             Catagory = c.Catagory,
                             Date = c.CapturedTime,
                             SourceType = "自动抓取",
                             Geometry = string.Empty,
                             Link = c.Link
                         })
                          .Union
           (from r in dbContext.ReportInfo
            where
                rCdts.status.Contains(r.Status)
            select new ReviewItem
            {
                SourceID = r.ID,
                Title = r.Title,
                Content = r.Content,
                Catagory = string.Empty,
                Date = r.ReportTime,
                SourceType = "用户上报",
                Geometry = r.Geometry,
                Link = string.Empty
            })
           .Where(
              p =>
                  p.Date >= rCdts.beginDate &&
                  p.Date <= rCdts.endDate &&
                  (rCdts.keyWord == null ? true : p.Content.Contains(rCdts.keyWord)) &&
                  rCdts.sourceType.Contains(p.SourceType)
              );
            //var t = (from c in dbContext.CapturedInfo
            //         where
            //                 rCdts.status.Contains(c.Status)
            //                 &&
            //                 rCdts.catagory.Contains(c.Catagory)
            //         select c
            //         //select new ReviewItem
            //         //{
            //         //    SourceID = c._ID.ToString(),
            //         //    Title = c.Title,
            //         //    Content = c.Content,
            //         //    Catagory = c.Catagory,
            //         //    Date = c.CapturedTime,
            //         //    SourceType = "自动抓取",
            //         //    Geometry = string.Empty
            //         //}
            //        ).ToList();
            //var t = query.ToList();
            var items = query.OrderByDescending(p => p.Date).Skip((rCdts.page - 1) * rCdts.rows).Take(rCdts.rows).ToList();

            var dict = new Dictionary<string, object>();
            dict["total"] = query.Count();
            dict["rows"] = items;
            return dict;
        }

        public static void UnpassReview(EFDbContext dbContext, ReviewItem reviewItem)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                object entity = null;
                if (
                    reviewItem.SourceType == SourceTypes.captured
                    &&
                    (entity = dbContext.CapturedInfo.Where(p => p._ID.ToString() == reviewItem.SourceID).FirstOrDefault()) != null
                    )
                {
                    (entity as CapturedInfo).Status = ReviewStatusTypes.unpassed;
                }
                else if (
                    reviewItem.SourceType == SourceTypes.report
                    &&
                    (entity = dbContext.ReportInfo.Where(p => p.ID == reviewItem.SourceID).FirstOrDefault()) != null
                    )
                {
                    (entity as ReportInfo).Status = ReviewStatusTypes.unpassed;
                }
                else
                    throw new Exception("未找到相应数据！");
                dbContext.SaveChanges();
                scope.Complete();
            }
        }
    }
}

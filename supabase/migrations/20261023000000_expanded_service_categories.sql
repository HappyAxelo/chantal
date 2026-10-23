-- Service catalogue restructured per the owner's comments on "Our Services":
-- adds quantity surveying, claims, governance and training categories.
-- 'mou' is kept so existing records remain valid (MoUs now sit under 'documentation').

alter table public.inquiries drop constraint if exists inquiries_service_category_check;
alter table public.inquiries add constraint inquiries_service_category_check
  check (service_category in ('fidic','quantity_surveying','contract','claims','procurement','governance','documentation','training','notarial','mou','general'));

alter table public.appointments drop constraint if exists appointments_service_category_check;
alter table public.appointments add constraint appointments_service_category_check
  check (service_category in ('fidic','quantity_surveying','contract','claims','procurement','governance','documentation','training','notarial','mou','general'));
